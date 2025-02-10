#! /usr/bin/env python3

import subprocess

subprocess.run(["bunx", "convex", "dev", "--once"])

print("=" * 80)
print("# Set these environment variables in the dashboard")

print("SITE_URL=http://localhost:3000")
subprocess.run(["node", "generateKeys.mjs"])
subprocess.run(['bunx', 'convex', 'dashboard'])

print("=" * 80)
print("# Clear cookies in the browser")
print("# Verify logging in works")
