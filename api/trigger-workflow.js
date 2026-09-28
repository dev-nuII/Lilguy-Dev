const owner = 'YOUR_GITHUB_USERNAME_OR_ORG'; 
const repo = 'YOUR_REPOSITORY_NAME'; 
const workflowId = 'deploy.yml';
// or workflow ID filename 
const token = 'YOUR_PERSONAL_ACCESS_TOKEN'; // Keep secret! 
statusText.textContent = 'Triggering workflow...'; 
try { 
  const response = await fetch(`https://github.com${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
  { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github+json', 'Content-Type': 'application/json', 'X-GitHub-Api-Version': '2022-11-28' }, 
                                                                                                        
 body: JSON.stringify({ ref: 'main', // Branch to run onm
inputs: { environment: 'production' } }) });
  if (response.ok) { statusText.textContent = 'Workflow triggered successfully!'; } 
  else { 
    const err = await response.json(); 
    statusText.textContent = `Failed: ${err.message}`; } } catch (error) { statusText.textContent = `Error: ${error.message}`; } });
