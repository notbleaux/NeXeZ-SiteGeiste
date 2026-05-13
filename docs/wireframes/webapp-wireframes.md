# WebApp Wireframes

## Overview

This document provides ASCII wireframes for the NeXeZ SiteGeiste WebApp, showing the PixelOffice-inspired interface with AI agent visualization and gamified project management.

## 1. Dashboard / Home View

```
┌─────────────────────────────────────────────────────────────────────┐
│ NeXeZ SiteGeiste                    🔍 Search    👤 User ▼    ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │
│  │ Projects   │  │ Agents     │  │ Quests     │  │ Analytics  │   │
│  │    5       │  │    5/5     │  │    12      │  │   ●●●●○    │   │
│  │   Active   │  │   Active   │  │   Active   │  │   82%      │   │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘   │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ 🏢 PixelOffice Workspace                            [Expand] │   │
│  ├──────────────────────────────────────────────────────────────┤   │
│  │                                                              │   │
│  │  ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐    ┌─────┐     │   │
│  │  │ 👓  │    │ 📐  │    │ 🔍  │    │ ✅  │    │ ⚓  │     │   │
│  │  │     │    │     │    │     │    │     │    │     │     │   │
│  │  │Code │    │Arch │    │Bug  │    │Test │    │Ship │     │   │
│  │  │IDLE │    │WORK │    │IDLE │    │DONE │    │IDLE │     │   │
│  │  └─────┘    └─────┘    └─────┘    └─────┘    └─────┘     │   │
│  │                                                              │   │
│  │  💬 "Architecture Guide is designing the auth system..."    │   │
│  │                                                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌──────────────────────────┐  ┌───────────────────────────────┐   │
│  │ 📋 Active Quests         │  │ 📊 Project Health             │   │
│  ├──────────────────────────┤  ├───────────────────────────────┤   │
│  │ ⚔️ Fix Auth Bug         │  │ Code Quality    ●●●●● 95%    │   │
│  │ Level: ⭐⭐ Int         │  │ Test Coverage   ●●●●○ 78%    │   │
│  │ XP: 50 | Status: 80%    │  │ Documentation   ●●●○○ 60%    │   │
│  │ Agent: 🔍               │  │ Performance     ●●●●● 92%    │   │
│  │ [View] [Chat]           │  │ Security        ●●●●● 100%   │   │
│  │                          │  │                               │   │
│  │ ⚔️ Implement Dashboard  │  │ Overall: ●●●●○ 82%          │   │
│  │ Level: ⭐⭐⭐ Adv       │  │                               │   │
│  │ XP: 100 | Status: 25%   │  │ [View Details]                │   │
│  │ Agent: 📐               │  └───────────────────────────────┘   │
│  │ [View] [Chat]           │                                       │
│  │                          │  ┌───────────────────────────────┐   │
│  │ [View All Quests →]     │  │ 🎯 Your Progress              │   │
│  └──────────────────────────┘  ├───────────────────────────────┤   │
│                                 │ Level 3: Developer            │   │
│                                 │ [████████░░] 842/1000 XP      │   │
│                                 │                               │   │
│                                 │ Recent Achievements:          │   │
│                                 │ 🏆 First Steps (10 XP)       │   │
│                                 │ 🐛 Bug Squasher (30 XP)      │   │
│                                 │                               │   │
│                                 │ [View Profile]                │   │
│                                 └───────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## 2. Project Detail View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard        MyApp Project                      ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📊 Project: MyApp                          Status: In Progress  │ │
│ │ Created: 2026-01-15  |  Owner: @username  |  Team: 3 members   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌───────────┬───────────┬───────────┬───────────┬───────────┐       │
│ │ Overview  │ Tasks     │ Agents    │ Files     │ Settings  │       │
│ └───────────┴───────────┴───────────┴───────────┴───────────┘       │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📋 Task Board (Kanban View)                    [List] [Office] │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                 │ │
│ │ ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │ │
│ │ │  TO DO   │  DOING   │ REVIEW   │ TESTING  │   DONE   │      │ │
│ │ ├──────────┼──────────┼──────────┼──────────┼──────────┤      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ 📋 Fix   │ ⚡ Impl  │ 👀 Add   │ 🧪 Test  │ ✅ Setup │      │ │
│ │ │ Auth Bug │ Dashboard│ Tests    │ API      │ Repo     │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ ⭐⭐ 50XP│ ⭐⭐⭐100│ ⭐ 30XP  │ ⭐⭐ 60XP│ ⭐ 10XP  │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ 🔍 Claim │ 📐 80%   │ ✅ Ready │ 👓 50%   │ 📐 Done  │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ 📋 Add   │          │          │          │ ✅ Docs  │      │ │
│ │ │ Feature  │          │          │          │ Update   │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ ⭐⭐⭐80 │          │          │          │ ⭐ 15XP  │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ │ [+]      │          │          │          │          │      │ │
│ │ │          │          │          │          │          │      │ │
│ │ └──────────┴──────────┴──────────┴──────────┴──────────┘      │ │
│ │                                                                 │ │
│ │ [+ New Task]                                  [Filter ▼] [⚙️] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🤖 Active Agents                                                │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                 │ │
│ │ 👓 Code Reviewer    [IDLE]     Last: Reviewed PR #123  2m ago │ │
│ │ 📐 Architect        [WORKING]  Current: Designing auth system  │ │
│ │ 🔍 Bug Hunter       [IDLE]     Last: Found 3 issues    5m ago │ │
│ │ ✅ Test Generator   [DONE]     Last: Completed tests   10m ago│ │
│ │ ⚓ Ship Manager     [IDLE]     Last: Deployed staging  1h ago │ │
│ │                                                                 │ │
│ │ [Manage Agents]                           [View Activity Feed] │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 3. Agent Detail / Chat View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                    👓 Code Reviewer                      ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 👓 Code Reviewer                                   Status: IDLE │ │
│ │                                                                 │ │
│ │ Type: AI Agent | Model: Claude Sonnet 4.5 | Role: Code Review │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌───────────┬───────────┬───────────┬───────────┐                   │
│ │ Chat      │ Activity  │ Stats     │ Settings  │                   │
│ └───────────┴───────────┴───────────┴───────────┘                   │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 💬 Chat with Code Reviewer                                      │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                 │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │ 👓 Code Reviewer                           2 minutes ago │  │ │
│ │  ├──────────────────────────────────────────────────────────┤  │ │
│ │  │ I've completed reviewing PR #123. Found 2 minor issues:  │  │ │
│ │  │                                                          │  │ │
│ │  │ 1. Missing error handling in auth.ts line 45           │  │ │
│ │  │ 2. Inconsistent naming in userService.ts               │  │ │
│ │  │                                                          │  │ │
│ │  │ Would you like me to create a detailed report?          │  │ │
│ │  │                                                          │  │ │
│ │  │ [View Issues] [Create Report] [Fix Now]                 │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                 │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │ You                                        1 minute ago  │  │ │
│ │  ├──────────────────────────────────────────────────────────┤  │ │
│ │  │ Yes, please create a detailed report.                    │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                 │ │
│ │  ┌──────────────────────────────────────────────────────────┐  │ │
│ │  │ 👓 Code Reviewer                            Just now     │  │ │
│ │  ├──────────────────────────────────────────────────────────┤  │ │
│ │  │ ⌛ Creating detailed code review report...              │  │ │
│ │  └──────────────────────────────────────────────────────────┘  │ │
│ │                                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌──────────────────────────────────────────────────────────────┐    │
│ │ Type your message...                         [📎] [😊] [🎤] │    │
│ │                                                      [Send →] │    │
│ └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📌 Quick Actions                                                │ │
│ │ • Assign Task        • View Code         • Run Tests           │ │
│ │ • Create Report      • Find Issues       • Check Style         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 4. Quest / Task Detail View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back to Tasks            Quest: Fix Authentication Bug        ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ⚔️ Quest: Fix Authentication Bug                    ID: #42    │ │
│ │                                                                 │ │
│ │ Level: ⭐⭐ Intermediate  |  XP Reward: 50  |  Status: 80%    │ │
│ │ Created: 2026-05-10      |  Assigned: 🔍 Bug Hunter           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌───────────┬───────────┬───────────┬───────────┐                   │
│ │ Details   │ Activity  │ Files     │ Comments  │                   │
│ └───────────┴───────────┴───────────┴───────────┘                   │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📝 Description                                                  │ │
│ │                                                                 │ │
│ │ Users are unable to login when using OAuth providers. The      │ │
│ │ authentication token is not being properly validated on the    │ │
│ │ server side, causing a 401 error.                              │ │
│ │                                                                 │ │
│ │ **Steps to Reproduce:**                                        │ │
│ │ 1. Navigate to login page                                      │ │
│ │ 2. Click "Login with Google"                                   │ │
│ │ 3. Complete OAuth flow                                         │ │
│ │ 4. Observe 401 error                                           │ │
│ │                                                                 │ │
│ │ **Expected Result:** User should be logged in successfully     │ │
│ │ **Actual Result:** 401 Unauthorized error                      │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🎯 Acceptance Criteria                                          │ │
│ │                                                                 │ │
│ │ ☐ OAuth token validation implemented                           │ │
│ │ ☐ Tests added for OAuth flow                                   │ │
│ │ ☐ Error handling improved                                      │ │
│ │ ☐ Documentation updated                                        │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 📊 Progress                              [████████░░] 80%       │ │
│ │                                                                 │ │
│ │ ✅ Issue identified                                             │ │
│ │ ✅ Root cause analysis completed                                │ │
│ │ ✅ Fix implemented                                              │ │
│ │ ⚡ Tests in progress                                            │ │
│ │ ☐ Code review pending                                          │ │
│ │ ☐ Documentation update                                         │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🔍 Related                                                      │ │
│ │                                                                 │ │
│ │ • PR #123: Fix OAuth token validation                          │ │
│ │ • Issue #38: Similar auth problem                              │ │
│ │ • File: src/services/auth.ts                                   │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ [ Claim Quest ] [ Chat with Agent ] [ View Code ] [ Mark Complete ] │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 5. User Profile / Progress View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                       Your Profile                       ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │         ┌─────┐                                                 │ │
│ │         │ 👤  │   Username                                      │ │
│ │         └─────┘   @username                                     │ │
│ │                                                                 │ │
│ │   Level 3: Developer  |  Member since: Jan 2026                │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌───────────┬───────────┬───────────┬───────────┐                   │
│ │ Progress  │ Achievemt │ Activity  │ Settings  │                   │
│ └───────────┴───────────┴───────────┴───────────┘                   │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🎯 Level Progress                                               │ │
│ │                                                                 │ │
│ │ Level 3: Developer                   [████████░░] 842/1000 XP  │ │
│ │                                                                 │ │
│ │ Next Level: Senior Developer                                   │ │
│ │ Unlocks: Advanced quests, Code review privileges, Mentoring    │ │
│ │                                                                 │ │
│ │ ┌─────────────────────────────────────────────────────────────┐│ │
│ │ │ Level History                                              ││ │
│ │ │ 👑 Lvl 5: Manager         (5000+ XP)    ○ Locked          ││ │
│ │ │ ⭐⭐⭐⭐ Lvl 4: Senior    (1501+ XP)    ○ Locked          ││ │
│ │ │ ⭐⭐⭐ Lvl 3: Developer   (501+ XP)     ● Current (842 XP) ││ │
│ │ │ ⭐⭐ Lvl 2: Apprentice    (101+ XP)     ✓ Completed       ││ │
│ │ │ ⭐ Lvl 1: Explorer        (0+ XP)       ✓ Completed       ││ │
│ │ └─────────────────────────────────────────────────────────────┘│ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌────────────────────────────────┬────────────────────────────────┐ │
│ │ 📊 Statistics                  │ 🏆 Recent Achievements         │ │
│ ├────────────────────────────────┼────────────────────────────────┤ │
│ │                                │                                │ │
│ │ Total XP Earned:      842      │ ┌───────────────────────────┐ │ │
│ │ Quests Completed:      12      │ │ 🏆 First Steps            │ │ │
│ │ Contributions:         45      │ │ Made your first commit!   │ │ │
│ │ Code Reviews:           8      │ │ +10 XP                    │ │ │
│ │ PRs Merged:            15      │ └───────────────────────────┘ │ │
│ │ Issues Resolved:       10      │                                │ │
│ │                                │ ┌───────────────────────────┐ │ │
│ │ Streak: 🔥 7 days              │ │ 🐛 Bug Squasher           │ │ │
│ │                                │ │ Fixed 5 bugs!             │ │ │
│ │ This Week:                     │ │ +30 XP                    │ │ │
│ │ • 3 Quests completed           │ └───────────────────────────┘ │ │
│ │ • 5 PRs merged                 │                                │ │
│ │ • 150 XP earned                │ ┌───────────────────────────┐ │ │
│ │                                │ │ 💻 Code Contributor       │ │ │
│ │ [View Details]                 │ │ Made 10 contributions     │ │ │
│ │                                │ │ +20 XP                    │ │ │
│ │                                │ └───────────────────────────┘ │ │
│ │                                │                                │ │
│ │                                │ [View All Achievements →]      │ │
│ └────────────────────────────────┴────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 6. Settings / Configuration View

```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Back                        Settings                          ⚙️    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ ⚙️ Settings                                                     │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐       │
│ │Profile  │Agents   │Projects │Notif.   │Privacy  │Advanced │       │
│ └─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘       │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 👤 Profile Settings                                             │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                 │ │
│ │ Display Name                                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────┐ │ │
│ │ │ Username                                                    │ │ │
│ │ └─────────────────────────────────────────────────────────────┘ │ │
│ │                                                                 │ │
│ │ Email                                                           │ │
│ │ ┌─────────────────────────────────────────────────────────────┐ │ │
│ │ │ user@example.com                                            │ │ │
│ │ └─────────────────────────────────────────────────────────────┘ │ │
│ │                                                                 │ │
│ │ Avatar                                                          │ │
│ │ ┌─────┐                                                         │ │
│ │ │ 👤  │  [Change Avatar] [Upload Custom]                       │ │
│ │ └─────┘                                                         │ │
│ │                                                                 │ │
│ │ Timezone                                                        │ │
│ │ ┌─────────────────────────────────────────────────────────────┐ │ │
│ │ │ UTC-5 (Eastern Time)                              ▼        │ │ │
│ │ └─────────────────────────────────────────────────────────────┘ │ │
│ │                                                                 │ │
│ │ Language                                                        │ │
│ │ ┌─────────────────────────────────────────────────────────────┐ │ │
│ │ │ English                                           ▼        │ │ │
│ │ └─────────────────────────────────────────────────────────────┘ │ │
│ │                                                                 │ │
│ │ Theme                                                           │ │
│ │ ○ Light  ● Dark  ○ Auto (match system)                        │ │
│ │                                                                 │ │
│ │ [Save Changes] [Cancel]                                        │ │
│ │                                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ 🤖 Agent Preferences                                            │ │
│ ├─────────────────────────────────────────────────────────────────┤ │
│ │                                                                 │ │
│ │ Default AI Model                                                │ │
│ │ ┌─────────────────────────────────────────────────────────────┐ │ │
│ │ │ Claude Sonnet 4.5                                 ▼        │ │ │
│ │ └─────────────────────────────────────────────────────────────┘ │ │
│ │                                                                 │ │
│ │ Agent Behavior                                                  │ │
│ │ ☑ Proactive suggestions                                        │ │
│ │ ☑ Auto-assign simple tasks                                     │ │
│ │ ☐ Require approval for code changes                           │ │
│ │ ☑ Show agent activity notifications                            │ │
│ │                                                                 │ │
│ │ Communication Style                                             │ │
│ │ ○ Formal  ● Casual  ○ Technical                               │ │
│ │                                                                 │ │
│ │ [Manage Agents] [View API Usage]                               │ │
│ │                                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 7. Command Palette (Cmd/Ctrl + K)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│    ┌───────────────────────────────────────────────────────────┐    │
│    │ 🔍 Type a command or search...                            │    │
│    ├───────────────────────────────────────────────────────────┤    │
│    │ Recent                                                    │    │
│    │ ► View Dashboard                                          │    │
│    │ ► Open Task #42: Fix Auth Bug                            │    │
│    │ ► Chat with Bug Hunter                            Cmd+B   │    │
│    │                                                           │    │
│    │ Actions                                                   │    │
│    │ ► Create New Task                                 Cmd+N   │    │
│    │ ► Assign Agent                                    Cmd+A   │    │
│    │ ► Deploy to Staging                                       │    │
│    │ ► Run Tests                                       Cmd+T   │    │
│    │                                                           │    │
│    │ Navigation                                                │    │
│    │ ► Go to Projects                                          │    │
│    │ ► Go to Agents                                            │    │
│    │ ► Go to Settings                                          │    │
│    │                                                           │    │
│    │ Agents                                                    │    │
│    │ ► 👓 Code Reviewer - Ask a question                      │    │
│    │ ► 📐 Architecture Guide - Get advice                     │    │
│    │ ► 🔍 Bug Hunter - Find issues                            │    │
│    │ ► ✅ Test Generator - Create tests                       │    │
│    │ ► ⚓ Ship Manager - Deploy                               │    │
│    └───────────────────────────────────────────────────────────┘    │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 8. Mobile Responsive View (Dashboard)

```
┌──────────────────────────┐
│ ☰  NeXeZ    🔍  👤  ⚙️  │
├──────────────────────────┤
│                          │
│ ┌──────────────────────┐ │
│ │ Projects      5      │ │
│ │ Agents      5/5      │ │
│ │ Quests       12      │ │
│ │ Health     ●●●●○     │ │
│ └──────────────────────┘ │
│                          │
│ 🏢 PixelOffice    [+]   │
│ ┌──────────────────────┐ │
│ │  👓   📐   🔍        │ │
│ │ IDLE WORK IDLE       │ │
│ │                      │ │
│ │  ✅   ⚓             │ │
│ │ DONE IDLE            │ │
│ └──────────────────────┘ │
│                          │
│ 📋 Active Quests         │
│ ┌──────────────────────┐ │
│ │ ⚔️ Fix Auth Bug     │ │
│ │ ⭐⭐ Int | 50 XP    │ │
│ │ [██████░░░░] 80%    │ │
│ │ 🔍 Bug Hunter       │ │
│ └──────────────────────┘ │
│                          │
│ ┌──────────────────────┐ │
│ │ ⚔️ Impl Dashboard   │ │
│ │ ⭐⭐⭐ Adv | 100XP  │ │
│ │ [████░░░░░░] 25%    │ │
│ │ 📐 Architect        │ │
│ └──────────────────────┘ │
│                          │
│ [View All →]             │
│                          │
│ 🎯 Your Progress         │
│ ┌──────────────────────┐ │
│ │ Level 3: Developer   │ │
│ │ [████████░░] 842 XP  │ │
│ │                      │ │
│ │ Recent:              │ │
│ │ 🏆 First Steps       │ │
│ │ 🐛 Bug Squasher      │ │
│ └──────────────────────┘ │
│                          │
├──────────────────────────┤
│ 🏠  📋  🤖  🎯  ⚙️      │
└──────────────────────────┘
```

## Notes

- All wireframes use ASCII art for clarity and easy documentation
- Pixel sprites (👓📐🔍✅⚓) represent the five AI agents
- Progress bars use block characters (█░) for visual representation
- Status indicators use emoji and text combinations
- Navigation is consistent across all views
- Mobile view adapts to vertical layout with bottom navigation

---

**Version**: 1.0.0
**Last Updated**: 2026-05-13
**Maintainer**: Design Team
