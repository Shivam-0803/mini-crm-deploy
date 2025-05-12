# Push Instructions

To push this code to your GitHub repository, follow these steps:

## Option 1: Using Personal Access Token (Recommended)

1. Go to GitHub.com and log in
2. Click on your profile picture -> Settings -> Developer settings -> Personal access tokens -> Tokens (classic)
3. Generate a new token with "repo" permissions
4. Copy the token
5. Run the following commands in the terminal:

```bash
git remote set-url origin https://Shivam-0803:<YOUR_TOKEN>@github.com/Shivam-0803/mini-crm-.git
git push -u origin main
```

Replace `<YOUR_TOKEN>` with the token you generated.

## Option 2: Manual Upload

If you continue to have authentication issues, you can upload the files manually:

1. Go to https://github.com/Shivam-0803/mini-crm-
2. Click "Add file" -> "Upload files"
3. Drag and drop or browse to upload all files
4. Commit the changes

The .gitignore file has been updated to exclude:
- .env
- backend/.env
- crm-frontend/.env

This ensures your environment variables and sensitive information don't get pushed to GitHub.
