# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Add mandatory instructions as part of prompt design
- Add profanity and moderation to outbound message
- Add slash command detection
- Add prompt leakage detection
- Add jailbreak detection
- Add secrets and credentials detection
- Add instruction for Minecraft-relevancy
- Add reply confidence score threshold check

### Changed
- Rename enableLogging to enableMessageLogging

## 1.1.3 - 2026-05-23
### Fixed
- Fix publishing by directly using npm publish and adding workflow permission

## 1.1.2 - 2026-05-23
### Fixed
- Fix publishing by switching to trusted publisher

## 1.1.1 - 2026-05-23
### Fixed
- Fix publishing workflow token

## 1.1.0 - 2026-05-23
### Added
- Add conversation history size setting
- Add reply moderation and profanity sanitising support
- Add reply logging support

### Changed
- Change default model to gpt-5.2
- Upgrade Suntory to 0.12.0

## 1.0.0 - 2026-03-20
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
