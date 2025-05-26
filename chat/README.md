# Chat Module

This directory contains the chat functionality that has been moved to the root level of the project.

## Structure

- `page.tsx` - Main chat component with UI and logic
- `_config/` - Configuration files for chat functionality
- `_hooks/` - Custom React hooks for chat features
- `_types/` - TypeScript type definitions
- `_utils/` - Utility functions

## Usage

The chat route is accessible at `/chat` in the web application. The web app's chat route (`apps/web/app/chat/page.tsx`) re-exports the component from this root-level directory.

## Dependencies

This module depends on components and configurations from the web app:
- Chat UI components from `apps/web/app/components/chat/`
- Header component from `apps/web/app/components/Header`
- Chain configuration from `apps/web/app/config/chains` 