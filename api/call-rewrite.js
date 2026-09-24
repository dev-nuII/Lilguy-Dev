const token = process.env.token;

      const response = await fetch(
        "https://api.github.com/repos/my-user/my-repo/actions/workflows/deploy.yml/dispatches",
        {
          method: "POST",
          headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2026-03-10",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              environment: "staging",
              version: "1.2.3"
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GitHub API error ${response.status}: ${error}`);
      }

      // Current API versions may return workflow run details.
      const result = await response.json().catch(() => null);

      console.log("Workflow triggered", result);
    });
