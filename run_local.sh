#!/bin/bash

# Local Sports Hub - Development Setup and Run Script
# This script handles common development tasks for the React Native Expo app

set -e  # Exit on any error

echo "🏃‍♂️ Local Sports Hub - Development Runner"
echo "========================================"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required dependencies
check_dependencies() {
    echo "📋 Checking dependencies..."
    
    if ! command_exists node; then
        echo "❌ Node.js not found. Please install Node.js (v18+)"
        exit 1
    fi
    
    if ! command_exists npm; then
        echo "❌ npm not found. Please install npm"
        exit 1
    fi
    
    echo "✅ Node.js version: $(node --version)"
    echo "✅ npm version: $(npm --version)"
    
    # Check if expo CLI is installed globally
    if ! command_exists expo; then
        echo "⚠️  Expo CLI not found globally. Installing..."
        npm install -g @expo/cli
    fi
    
    echo "✅ Expo CLI version: $(expo --version)"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed successfully"
}

# Start development server
start_dev() {
    echo "🚀 Starting Expo development server..."
    echo "📱 This will open Expo Go app or emulator"
    echo "🌐 Web version will be available at http://localhost:8081"
    
    # Clear cache and start
    export EXPO_NO_TELEMETRY=1
    npx expo start --clear
}

# Start for specific platforms
start_android() {
    echo "🤖 Starting Android development..."
    export EXPO_NO_TELEMETRY=1
    npx expo start --android
}

start_ios() {
    echo "🍎 Starting iOS development..."
    if [[ "$OSTYPE" != "darwin"* ]]; then
        echo "❌ iOS development requires macOS"
        exit 1
    fi
    export EXPO_NO_TELEMETRY=1
    npx expo start --ios
}

start_web() {
    echo "🌐 Starting web development..."
    export EXPO_NO_TELEMETRY=1
    npx expo start --web
}

# Run linting
run_lint() {
    echo "🔍 Running ESLint..."
    if [ -f "node_modules/.bin/eslint" ]; then
        npx eslint . --ext .ts,.tsx,.js,.jsx
        echo "✅ Linting completed"
    else
        echo "⚠️  ESLint not configured. Skipping linting."
    fi
}

# Run type checking
run_typecheck() {
    echo "🔧 Running TypeScript type checking..."
    npx tsc --noEmit
    echo "✅ Type checking completed"
}

# Run tests
run_tests() {
    echo "🧪 Running tests..."
    if [ -f "package.json" ] && grep -q '"test"' package.json; then
        npm test
    else
        echo "⚠️  No test script configured. Skipping tests."
    fi
}

# Build for production
build_app() {
    echo "🏗️  Building app for production..."
    export EXPO_NO_TELEMETRY=1
    npx expo export --platform web
    echo "✅ Build completed - check dist/ folder"
}

# Clean cache and reset
clean_reset() {
    echo "🧹 Cleaning cache and resetting..."
    
    # Clear Expo cache
    if command_exists expo; then
        npx expo r -c
    fi
    
    # Clear npm cache
    npm cache clean --force
    
    # Remove node_modules and reinstall
    echo "📦 Removing node_modules and reinstalling..."
    rm -rf node_modules
    rm -f package-lock.json
    npm install
    
    echo "✅ Reset completed"
}

# Setup Firebase (reminder)
setup_firebase() {
    echo "🔥 Firebase Setup Reminder"
    echo "=========================="
    echo "1. Create a Firebase project at https://console.firebase.google.com"
    echo "2. Enable Authentication (Email/Password provider)"
    echo "3. Create Firestore database"
    echo "4. Enable Storage"
    echo "5. Update firebase.config.ts with your project configuration"
    echo "6. Import sample data from database-export/sample-data.json"
    echo ""
    echo "📄 See README.md for detailed Firebase setup instructions"
}

# Show help
show_help() {
    echo "Local Sports Hub - Development Commands"
    echo ""
    echo "Usage: ./run_local.sh [command]"
    echo ""
    echo "Available commands:"
    echo "  start, dev          Start development server (default)"
    echo "  android            Start Android development"
    echo "  ios                Start iOS development (macOS only)"
    echo "  web                Start web development"
    echo "  install            Install dependencies"
    echo "  lint               Run ESLint"
    echo "  typecheck          Run TypeScript type checking"
    echo "  test               Run tests"
    echo "  build              Build for production"
    echo "  clean              Clean cache and reset"
    echo "  firebase-setup     Show Firebase setup instructions"
    echo "  help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./run_local.sh                    # Start development server"
    echo "  ./run_local.sh android           # Start Android development"
    echo "  ./run_local.sh lint typecheck    # Run linting and type checking"
}

# Main script logic
main() {
    # If no arguments provided, show help and start development
    if [ $# -eq 0 ]; then
        check_dependencies
        install_dependencies
        start_dev
        return
    fi
    
    # Process each argument
    for arg in "$@"; do
        case $arg in
            "start"|"dev")
                check_dependencies
                install_dependencies
                start_dev
                ;;
            "android")
                check_dependencies
                install_dependencies
                start_android
                ;;
            "ios")
                check_dependencies
                install_dependencies
                start_ios
                ;;
            "web")
                check_dependencies
                install_dependencies
                start_web
                ;;
            "install")
                check_dependencies
                install_dependencies
                ;;
            "lint")
                run_lint
                ;;
            "typecheck")
                run_typecheck
                ;;
            "test")
                run_tests
                ;;
            "build")
                check_dependencies
                build_app
                ;;
            "clean")
                clean_reset
                ;;
            "firebase-setup")
                setup_firebase
                ;;
            "help"|"-h"|"--help")
                show_help
                ;;
            *)
                echo "❌ Unknown command: $arg"
                echo "Use './run_local.sh help' to see available commands"
                exit 1
                ;;
        esac
    done
}

# Run main function with all arguments
main "$@"