import { Octokit } from '@octokit/rest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

async function getAllFiles(dir, baseDir = dir) {
  const files = []
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    // Skip node_modules, .git, dist, and other common ignore patterns
    if (item === 'node_modules' || item === '.git' || item === 'dist' || 
        item === '.env' || item.startsWith('.') || item === 'server/github-upload.js') {
      continue
    }
    
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir))
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      files.push({
        path: relativePath,
        content: fs.readFileSync(fullPath, 'utf8')
      })
    }
  }
  
  return files
}

async function createGitHubRepo() {
  try {
    const octokit = await getUncachableGitHubClient()
    
    // Get user info
    const { data: user } = await octokit.rest.users.getAuthenticated()
    console.log(`Conectado como: ${user.login}`)
    
    const repoName = 'sports-betting-platform'
    
    // Check if repo exists
    try {
      await octokit.rest.repos.get({
        owner: user.login,
        repo: repoName
      })
      console.log(`Repositório ${repoName} já existe. Atualizando arquivos...`)
    } catch (error) {
      if (error.status === 404) {
        // Create new repository
        console.log(`Criando novo repositório: ${repoName}`)
        await octokit.rest.repos.createForAuthenticatedUser({
          name: repoName,
          description: 'Plataforma completa de gerenciamento de apostas esportivas com análise de performance e gestão de banca',
          private: false,
          auto_init: true
        })
        console.log('Repositório criado com sucesso!')
      } else {
        throw error
      }
    }
    
    // Get all files from project
    const projectRoot = path.join(__dirname, '..')
    const files = await getAllFiles(projectRoot)
    
    console.log(`Enviando ${files.length} arquivos...`)
    
    // Create or update files
    for (const file of files) {
      try {
        // Check if file exists
        let sha = null
        try {
          const { data: existingFile } = await octokit.rest.repos.getContent({
            owner: user.login,
            repo: repoName,
            path: file.path
          })
          sha = existingFile.sha
        } catch (error) {
          // File doesn't exist, that's fine
        }
        
        // Create or update file
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: user.login,
          repo: repoName,
          path: file.path,
          message: sha ? `Update ${file.path}` : `Add ${file.path}`,
          content: Buffer.from(file.content).toString('base64'),
          sha: sha
        })
        
        console.log(`✓ ${file.path}`)
      } catch (error) {
        console.error(`Erro ao enviar ${file.path}:`, error.message)
      }
    }
    
    console.log('\n🎉 Upload concluído com sucesso!')
    console.log(`📂 Repositório: https://github.com/${user.login}/${repoName}`)
    
  } catch (error) {
    console.error('Erro durante o upload:', error.message)
  }
}

createGitHubRepo()