# Automated Build and Deployment System - Setup Guide

This guide will walk you through the manual steps needed to enable the automated build and deployment system for your Modulove firmware.

## Overview

The system consists of two parts:

1. **A-RYTH-MATIK Repository**: Builds firmware and creates GitHub releases
2. **modulove.github.io Repository**: Hosts the Hugo-based website with web-based firmware flashing

## Prerequisites

- Admin access to both GitHub repositories
- Ability to create GitHub Personal Access Tokens
- Ability to configure GitHub Pages

---

## Part 1: A-RYTH-MATIK Repository Setup

### Step 1: Push the Workflow File

The build workflow has been created at:
```
A-RYTH-MATIK/.github/workflows/build_release.yml
```

**Action Required:**
1. Commit and push this file to the `main` branch of your A-RYTH-MATIK repository
2. Verify it appears in GitHub under: `Settings → Actions → Workflows`

### Step 2: Create a GitHub Personal Access Token (PAT)

This token will allow the A-RYTH-MATIK workflow to trigger the Hugo deployment on modulove.github.io.

**Action Required:**

1. Go to GitHub Settings (your personal settings, not repository settings)
2. Navigate to: `Settings → Developer settings → Personal access tokens → Tokens (classic)`
3. Click "Generate new token" → "Generate new token (classic)"
4. Configure the token:
   - **Note**: `Modulove Deployment Token`
   - **Expiration**: Choose "No expiration" or set a long duration
   - **Scopes**: Select the following:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
5. Click "Generate token"
6. **IMPORTANT**: Copy the token immediately (you won't be able to see it again!)

### Step 3: Add the Token to A-RYTH-MATIK Repository

**Action Required:**

1. Go to your A-RYTH-MATIK repository on GitHub
2. Navigate to: `Settings → Secrets and variables → Actions`
3. Click "New repository secret"
4. Configure the secret:
   - **Name**: `MODULOVE_DEPLOY_TOKEN`
   - **Secret**: Paste the token you copied in Step 2
5. Click "Add secret"

### Step 4: Enable GitHub Actions

**Action Required:**

1. Go to your A-RYTH-MATIK repository on GitHub
2. Navigate to: `Settings → Actions → General`
3. Under "Actions permissions", select: **"Allow all actions and reusable workflows"**
4. Under "Workflow permissions", select: **"Read and write permissions"**
5. Check: ✅ "Allow GitHub Actions to create and approve pull requests"
6. Click "Save"

---

## Part 2: modulove.github.io Repository Setup

### Step 5: Push Hugo Site Files

All Hugo site files have been created in your local modulove.github.io repository.

**Action Required:**

1. Commit and push all the new files to the `main` branch:
   ```bash
   cd modulove.github.io/modulove.github.io
   git add .
   git commit -m "Add Hugo site with automated firmware deployment"
   git push origin main
   ```

### Step 6: Enable GitHub Pages

**Action Required:**

1. Go to your modulove.github.io repository on GitHub
2. Navigate to: `Settings → Pages`
3. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
4. Click "Save"

### Step 7: Configure GitHub Actions for modulove.github.io

**Action Required:**

1. Go to your modulove.github.io repository on GitHub
2. Navigate to: `Settings → Actions → General`
3. Under "Actions permissions", select: **"Allow all actions and reusable workflows"**
4. Under "Workflow permissions", select: **"Read and write permissions"**
5. Check: ✅ "Allow GitHub Actions to create and approve pull requests"
6. Click "Save"

### Step 8: Verify CNAME (if using custom domain)

If you want to use a custom domain like `firmware.modulove.io`:

**Action Required:**

1. Update the CNAME file with your custom domain
2. Configure DNS settings with your domain provider
3. Update `baseurl` in `config.toml` to match your domain

If using the default `modulove.github.io` domain, no action needed.

---

## Part 3: Testing the System

### Step 9: Create Your First Release

Now let's test the entire system!

**Action Required:**

1. Go to your A-RYTH-MATIK repository
2. Navigate to: `Actions` tab
3. Click on "Build and Release Firmware" workflow
4. Click "Run workflow" button
5. Select branch: `main`
6. Click "Run workflow"

This will:
- Compile all 5 firmware variants for both Arduino Nano boards
- Create standard and reversed encoder versions (10 files per firmware = 50 .hex files total)
- Upload them as workflow artifacts

### Step 10: Create a Git Tag for Official Release

To create an official release with all firmware files:

**Action Required:**

```bash
cd A-RYTH-MATIK
git tag -a v1.0.0 -m "First automated release"
git push origin v1.0.0
```

This will:
1. Trigger the build workflow automatically
2. Compile all firmware variants
3. Create a GitHub Release with all .hex files attached
4. Trigger the Hugo deployment on modulove.github.io
5. Deploy your website with firmware flashing capabilities

### Step 11: Verify the Website

**Action Required:**

1. Wait 3-5 minutes for the deployment to complete
2. Navigate to: `https://modulove.github.io`
3. Check that:
   - The homepage loads correctly
   - The A-RYTH-MATIK page shows all firmware options
   - The flash buttons are visible
4. To test flashing (optional):
   - Connect an Arduino Nano via USB
   - Click a flash button
   - Follow browser prompts

---

## Troubleshooting

### Build workflow fails

**Check:**
- All library dependencies are accessible
- The workflow has proper permissions
- GitHub Actions are enabled

**Fix:**
- Review the workflow logs in the Actions tab
- Check that all library URLs are correct
- Verify Arduino CLI can access the libraries

### Hugo deployment fails

**Check:**
- GitHub Pages is enabled and set to "GitHub Actions"
- The modulove.github.io repository has write permissions
- The theme downloads correctly

**Fix:**
- Review the workflow logs
- Verify the Hugo theme repository is accessible
- Check that the `public/` directory is created

### Firmware files don't appear on website

**Check:**
- The A-RYTH-MATIK release was created successfully
- The release contains .hex files as assets
- The GitHub token has proper permissions

**Fix:**
- Manually trigger the Hugo workflow: `Actions → Deploy Hugo site → Run workflow`
- Check the "Download latest firmware releases" step in the workflow logs
- Verify the `public/releases/` directory contains .hex files

### Flash buttons don't work

**Check:**
- Using Chrome, Edge, or Opera browser (Web Serial API required)
- The .hex files are accessible at `/releases/FIRMWARE_NAME.hex`
- JavaScript console for errors

**Fix:**
- Clear browser cache
- Check browser console (F12) for errors
- Verify the Arduino Web Uploader script is loading

---

## Updating Firmware in the Future

Once set up, updating firmware is easy:

### For Development Builds

Run the workflow manually from the Actions tab.

### For Official Releases

```bash
cd A-RYTH-MATIK
git add .
git commit -m "Update firmware"
git push
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

Everything else happens automatically!

---

## System Architecture

### Workflow Sequence

```
[Push Git Tag v1.x.x to A-RYTH-MATIK]
         ↓
[Build Firmware (all variants)]
         ↓
[Create GitHub Release with .hex files]
         ↓
[Trigger Hugo Deployment on modulove.github.io]
         ↓
[Hugo builds site + downloads .hex files]
         ↓
[Deploy to GitHub Pages]
         ↓
[Users can flash firmware from browser]
```

### File Structure

**A-RYTH-MATIK:**
```
A-RYTH-MATIK/
├── .github/
│   └── workflows/
│       └── build_release.yml
└── Firmware/
    ├── ARYTHMATIK_Buds/
    ├── ARYTHMATIK_Euclid/
    ├── ARYTHMATIK_Gate-seq/
    ├── ARYTHMATIK_Labor/
    └── ARYTHMATIK_Pong/
```

**modulove.github.io:**
```
modulove.github.io/
├── .github/
│   └── workflows/
│       └── hugo.yml
├── archetypes/
├── content/
│   ├── _index.md
│   ├── about.md
│   └── arythmatik.md
├── layouts/
│   ├── partials/
│   │   └── extended_footer.html
│   └── shortcodes/
│       ├── encoder_firmware_button.html
│       └── firmware_button.html
├── static/
└── config.toml
```

---

## Success Criteria

✅ You know the system is working when:

1. Pushing a git tag to A-RYTH-MATIK triggers a build
2. A GitHub Release is created with all .hex files
3. The modulove.github.io site updates automatically
4. Firmware files are available at `https://modulove.github.io/releases/`
5. Flash buttons on the website can upload firmware to Arduino

---

## Need Help?

If you encounter issues:

1. Check the workflow logs in the Actions tab
2. Review the troubleshooting section above
3. Create an issue in the repository
4. Check that all secrets and permissions are configured correctly

---

## Credits

This system is inspired by Adam Wonak's excellent HagiwoModulove project:
https://github.com/awonak/HagiwoModulove

Adapted for the Modulove ecosystem with enhanced automation and web-based firmware flashing.
