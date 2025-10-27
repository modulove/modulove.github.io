# Modulove Firmware Website

This repository hosts the Modulove firmware website with automated build and deployment system.

## Features

- **Web-Based Firmware Flashing**: Flash firmware directly from your browser to Arduino-based modules
- **Automated Builds**: GitHub Actions automatically compile firmware on each release
- **Hugo Static Site**: Fast, responsive documentation and firmware delivery
- **Multi-Board Support**: Works with Arduino Nano and Arduino Nano (Old Bootloader)

## Live Site

Visit [https://modulove.github.io](https://modulove.github.io) to flash firmware to your modules.

## Setup Instructions

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete setup instructions.

## Quick Start for Developers

### Local Development

```bash
# Install Hugo
# https://gohugo.io/installation/

# Clone the theme
git clone https://github.com/panr/hugo-theme-terminal.git themes/terminal

# Run local server
hugo server -D

# Visit http://localhost:1313
```

### Adding New Firmware

1. Add firmware documentation to `content/`
2. Use the shortcode for flash buttons:
   ```
   {{< encoder_firmware_button hex="FIRMWARE_NAME" buttonText="Flash Firmware" >}}
   ```
3. Ensure firmware is built and released in the source repository

### Project Structure

```
.
├── .github/workflows/     # GitHub Actions workflows
├── archetypes/            # Content templates
├── content/               # Markdown content
├── layouts/               # Hugo layout overrides
│   ├── partials/          # Partial templates
│   └── shortcodes/        # Custom shortcodes
├── static/                # Static assets
└── config.toml            # Hugo configuration
```

## Automated Workflow

1. Tag pushed to A-RYTH-MATIK repository
2. Firmware compiled for all variants
3. GitHub Release created with .hex files
4. This site rebuilds and fetches latest firmware
5. Deployed to GitHub Pages

## Contributing

Contributions welcome! Please open an issue or pull request.

## License

See individual firmware repositories for licensing information.
