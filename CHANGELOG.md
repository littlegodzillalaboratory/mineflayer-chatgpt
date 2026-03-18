# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Add memory support to record conversations history between bot and players
- Add instruction and conversation history to message payload
- Add Suntory as Makefile build tool

### Changed
- Upgraded itzg/minecraft-server to 2026.3.1
- Change integration test to run Minecraft server in offline mode
- Switch release workflow to use release-action
- Upgrade mineflayer to 4.35.0
- Update ESLint config to eslint.config.js
- Change default model to gpt-4o
- Change min node engine to 22.0.0
- Switch GitHub ID to littlegodzillalaboratory

### Fixed
- Fix intermittent integration test failure due to Minecraft server startup and readiness time

## 0.10.0 - 2024-04-28
### Added
- Initial version
