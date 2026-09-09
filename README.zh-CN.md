# Dev Flow

[English](README.md) | [简体中文](README.zh-CN.md)

一套面向 Codex 的开发流程 skill 包，从需求澄清推进到经过 review 的 PR，并在关键决策处等待用户确认。

Dev Flow 识别用户意图、编排五个 skills，并从当前阶段继续工作。项目命令、架构和测试约定来自仓库自己的 `AGENTS.md` 及已有配置。

## 开发流程

```text
提出需求 -> 意图识别 -> grilling -> 确认需求
  -> spec 草稿 -> 相似 issue 检查 -> 发布 spec
  -> 拆分方案 -> 用户确认拆分 -> 相似 issue 检查
  -> 创建 tickets -> branch -> 开发 + draft PR
  -> 本地检查 -> CI -> code review -> 修复 -> 重新 CI + review
  -> 完成的 PR -> 用户确认合并 -> merge
  -> 核实合并成功 -> 清理来源分支
```

流程中有三个用户确认点：

| 确认点 | 确认内容 |
| --- | --- |
| 需求确认 | 预期行为、验收标准和范围；已有明确确认的需求可以复用。 |
| 拆分确认 | ticket 的拆分粒度和依赖关系；确认后才发布 tickets、开始对应开发。 |
| 合并确认 | CI、review 和修复完成后的具体 PR；确认后才合并或加入合并队列。 |

发布 spec issue 或 ticket 前，还会触发一项条件确认：agent 搜索当前仓库中开启和关闭的 issues，检查是否存在类似功能。如果找到可能重叠的需求，会列出链接、相同点和差异，等你决定复用、补充现有 issue、单独新建，还是不再创建。需求确认或拆分确认不等于已经决定如何处理重复需求。搜索无法完成时，保留草稿，不发布。

确认点之间，agent 自动处理测试方案、开发、CI 排障和 review 修复。PR 的 head 提交变化后，需要重新检查、review，并重新获得合并确认。

核实合并成功后，自动删除符合清理条件的远程和本地来源分支，无需再次确认。有新提交、被其他 PR 依赖或仍被 worktree 使用的分支会保留，并报告待清理原因。不会删除目标分支、默认分支或受保护分支。

## 包含的 Skills

| Skill | 职责 |
| --- | --- |
| [dev-flow](skills/dev-flow/SKILL.md) | 意图路由、阶段编排、确认点和中断恢复。 |
| [grilling](skills/grilling/SKILL.md) | 按轮次询问当前可独立决定的问题，完善需求。 |
| [to-spec](skills/to-spec/SKILL.md) | 将已达成一致的需求整理为 spec。 |
| [to-tickets](skills/to-tickets/SKILL.md) | 提出可验证的交付切片，发布用户确认后的 tickets。 |
| [code-review](skills/code-review/SKILL.md) | 分别独立检查代码规范和需求实现情况。 |

四个配套 skills 基于 [Matt Pocock 的 skills](https://github.com/mattpocock/skills) 适配。来源版本和改动记录见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) 与 [upstream-lock.json](upstream-lock.json)。

## 安装

需要支持本地 skills 的 Codex、Git、已认证的 issue/PR connector 或 CLI，以及用于独立 review 的子 agent 能力。目标项目本身的开发依赖需要正常安装。

请保留整个仓库。入口通过包内路径读取配套 skills，仅复制 `skills/dev-flow` 目录会丢失依赖。

### macOS / Linux

```bash
git clone https://github.com/YinFengWindy/dev-flow.git ~/plugins/dev-flow
mkdir -p ~/.agents/skills
ln -s ~/plugins/dev-flow/skills/dev-flow ~/.agents/skills/dev-flow
```

### Windows PowerShell

```powershell
git clone https://github.com/YinFengWindy/dev-flow.git "$env:USERPROFILE/plugins/dev-flow"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE/.agents/skills" | Out-Null
New-Item -ItemType Junction -Path "$env:USERPROFILE/.agents/skills/dev-flow" -Target "$env:USERPROFILE/plugins/dev-flow/skills/dev-flow"
```

克隆和链接时请使用尚未占用的路径。若已有 `dev-flow` 入口，先检查其指向，再决定是否替换。上述命令只链接流程入口，不覆盖已经安装的独立 Matt skills。自动发现和符号链接支持见 [Codex 官方 skill 文档](https://learn.chatgpt.com/docs/build-skills)。

在目标项目里新建 Codex 任务，使用 `$dev-flow`。也可以直接让 Codex 读取克隆目录中的 `skills/dev-flow/SKILL.md`。仓库包含用于插件打包的 `.codex-plugin/plugin.json`；上述入口链接安装方式不要求注册插件市场。

## 使用示例

```text
$dev-flow 我想增加保存搜索条件的功能，先帮我完善需求。
$dev-flow 按已经确认的需求实现 issue #42。
$dev-flow 继续当前 PR，处理 CI 和 review。
$dev-flow 只整理 spec，不发布 issues，也不开发。
$dev-flow 只 review PR #42，不改代码、不合并。
```

意图路由会尊重用户指定的终点。只讨论就停留在讨论；已有的 spec、issue 和 PR 会复用。开发过程中询问进度，不会重新启动整条流程。

## 执行边界

- Skill 为当前 agent 任务提供指导，不是任务结束后仍持续运行的调度器或后台服务。
- 缺少权限、必要 CI 或平台要求的审批时，会明确报告阻塞。Agent review 不替代平台要求的人类或 Code Owner 审批。
- CI 和 review 必须对应当前 PR head。没有检查结果、结果过期或存在未解决的阻断问题，都不能合并。
- 流程会记录进度和确认状态，恢复时避免重复创建 issues 或 PR。
- 实际操作由运行时工具执行。这些 Markdown 指令不会替你安装分支保护，也不能保证模型始终遵守每条指令。

## 更新

在克隆目录执行 `git pull --ff-only`，然后新建 Codex 任务。链接的入口会使用更新后的仓库内容。

包内 Matt skills 固定到同一个上游提交，不会在运行时自动读取 `main`。升级时应比较上游变化，保留流程确认规则，更新版本锁定和来源说明，并验证 skill 元数据及相对路径。

## 许可证

MIT，见 [LICENSE](LICENSE)。包内 Matt Pocock 内容保留其版权和 MIT 声明，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
