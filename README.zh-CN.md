# Dev Flow

[English](README.md) | [简体中文](README.zh-CN.md)

一套面向 Codex 的开发流程 skill 包，从需求澄清推进到通过检查的 PR，按改动类型决定是否 review，并在关键决策处等待用户确认。

Dev Flow 识别用户意图，把实现和必要的 review 交给子代理，并从当前阶段继续工作。一次安装包含流程入口和四个配套 skills。项目命令、架构和测试约定来自仓库自己的 `AGENTS.md` 及已有配置。

## 开发流程

```text
提出需求 -> 意图识别 -> grilling -> 确认需求
  -> spec 草稿 -> 相似 issue 检查 -> 发布 spec
  -> 拆分方案 -> 用户确认拆分
  -> 创建 tickets -> branch -> 实现子代理 -> 主代理集成 + PR
  -> 本地检查 -> CI -> 按需调用 review 子代理 -> 修复 -> 重新检查
  -> 完成的 PR -> 用户确认合并 -> merge
  -> 核实合并成功 -> 清理来源分支
```

流程中有三个用户确认点：

| 确认点 | 确认内容 |
| --- | --- |
| 需求确认 | 预期行为、验收标准和范围；已有明确确认的需求可以复用。 |
| 拆分确认 | ticket 的拆分粒度和依赖关系；确认后才发布 tickets、开始对应开发。 |
| 合并确认 | CI、必要的 review 和修复完成后的具体 PR；确认后才合并或加入合并队列。 |

相似 issue 检查只放在 spec 草稿之后：agent 搜索当前仓库中开启和关闭的 issues，检查是否存在类似功能。如果找到可能重叠的需求，会列出链接、相同点和差异，等你决定复用、补充现有 issue、单独新建，还是不再创建，再发布 spec。后续拆分和发布 tickets 直接复用这个决定，不再进行第二次查重。搜索无法完成时，保留 spec 草稿，不发布。

确认点之间，主代理把代码实现和本地检查交给实现子代理，再核实实际 diff 和证据，处理 Git、PR 和 CI。需要 review 时，两个独立只读子代理分别检查 Standards 和 Spec；修复交回实现子代理。PR 的 head 提交变化后，需要重新检查、判断是否需要 review，并重新获得合并确认。

## 子代理与执行上下文

| 角色 | 职责 |
| --- | --- |
| 主代理 | 产品决策与用户确认、issue/PR 操作、分支准备、集成、commit/push、CI、合并和清理。 |
| 实现子代理 | 一个已确认且未被阻塞的 ticket、指定范围内的代码修改、本地行为检查和证据回执。 |
| Review 子代理 | 仅在需要 review 时，对同一份固定 diff 分别给出 Standards 和 Spec 检查结果。 |

默认同一时间只有一个实现子代理。主代理等写入结束后才操作 Git 或启动 review；并行实现需要隔离 worktree 和明确的修改范围。原生子代理不会自动创建新的用户可见任务。实现子代理不可用时，主代理说明后在当前任务内实现；必要的独立 review 仍需要实际审查代理。

参考 [matt-skills-with-to-goal](https://github.com/tt-a1i/matt-skills-with-to-goal)，流程吸收了三种轻量记录：

- `SPEC READY` 标明最终已确认的需求来源、基线、验证方式和待确认事项，不绕过拆分确认。
- 可选的执行契约用于跨会话交接一个已确认 ticket，区分已经证实完成、尚未完成和未验证的验收项，不重新访谈已决定的需求。
- 执行回执用证据对应验收标准，区分待合并确认、已合并、部分完成和阻塞。

普通小改动留在当前任务完成。交接是可选项，不新增强制 goal 阶段、自动 fork、messenger 依赖或模型切换。具体规则见[子代理分工](skills/dev-flow/references/delegation.md)和[执行上下文](skills/dev-flow/references/execution.md)。

## 哪些改动不需要 Review

小范围功能改动和纯 UI 改动跳过自动 code review。纯 UI 包括布局、样式、文案、图标、响应式适配和展示交互，不以文件数量为限制。Agent 会记录跳过原因，在必要检查和 CI 通过后进入合并确认。

涉及后端行为、共享契约、权限、认证、计费、持久化或数据删除的改动，不会因为修改了组件就算作纯 UI。包含实质性非 UI 行为的混合改动、广泛重构仍需要 review。用户明确要求 review 时，按该要求执行。

跳过 code review 不会跳过 CI、行为验证、UI 视觉和交互检查、平台要求的审批，也不会跳过你的合并确认。

核实合并成功后，自动删除符合清理条件的远程和本地来源分支，无需再次确认。有新提交、被其他 PR 依赖或仍被 worktree 使用的分支会保留，并报告待清理原因。不会删除目标分支、默认分支或受保护分支。

## 包含的 Skills

| Skill | 职责 |
| --- | --- |
| [dev-flow](skills/dev-flow/SKILL.md) | 意图路由、阶段编排、确认点和中断恢复。 |
| [grilling](skills/dev-flow/skills/grilling/SKILL.md) | 按轮次询问当前可独立决定的问题，完善需求。 |
| [to-spec](skills/dev-flow/skills/to-spec/SKILL.md) | 将已达成一致的需求整理为 spec。 |
| [to-tickets](skills/dev-flow/skills/to-tickets/SKILL.md) | 提出可验证的交付切片，发布用户确认后的 tickets。 |
| [code-review](skills/dev-flow/skills/code-review/SKILL.md) | 分别独立检查代码规范和需求实现情况。 |

四个配套 skills 基于 [Matt Pocock 的 skills](https://github.com/mattpocock/skills) 适配。来源版本和改动记录见[来源声明](skills/dev-flow/THIRD_PARTY_NOTICES.md)与 [upstream-lock.json](skills/dev-flow/upstream-lock.json)。

## 安装

安装需要 Node.js/npm；执行需要支持本地 skills 和原生子代理的 Codex、Git，以及已认证的 issue/PR connector 或 CLI。目标项目本身的开发依赖需要正常安装。

使用 [skills CLI](https://github.com/vercel-labs/skills) 全局安装，Windows、macOS 和 Linux 使用同一条命令：

```bash
npx skills@latest add YinFengWindy/dev-flow --skill dev-flow --agent codex -g
```

仅安装到当前项目时，在该项目目录运行上述命令并去掉 `-g`。一次安装会保留完整的 `dev-flow` 目录，包括嵌套的配套 skills、流程参考和许可证，不会另行安装或覆盖独立的 `grilling`、`to-spec`、`to-tickets`、`code-review` 入口。请安装父级 `dev-flow`，不要用 `--full-depth` 单独选取嵌套依赖。

如果以前用过手动链接或其他 `dev-flow` 入口，先检查旧入口，保留一份有效安装，避免重复加载。无需单独发布 npm 包、注册插件市场或手动克隆仓库。`.codex-plugin/plugin.json` 仍保留用于插件打包。

在目标项目里新建 Codex 任务，使用 `$dev-flow`。开发本仓库时，也可以执行 `npx skills@latest add . --skill dev-flow --agent codex` 安装工作树版本，或直接让 Codex 读取 `skills/dev-flow/SKILL.md`。

## 使用示例

```text
$dev-flow 我想增加保存搜索条件的功能，先帮我完善需求。
$dev-flow 按已经确认的需求实现 issue #42。
$dev-flow 继续当前 PR，处理 CI 和 review。
$dev-flow 只整理 spec，不发布 issues，也不开发。
$dev-flow 只 review PR #42，不改代码、不合并。
$dev-flow 为已确认的 ticket #42 整理执行契约，暂不实现。
```

意图路由会尊重用户指定的终点。只讨论就停留在讨论；已有的 spec、issue 和 PR 会复用。开发过程中询问进度，不会重新启动整条流程。

## 执行边界

- Skill 为当前 agent 任务提供指导，不是任务结束后仍持续运行的调度器或后台服务。
- 缺少权限、必要 CI 或平台要求的审批时，会明确报告阻塞。Agent review 不替代平台要求的人类或 Code Owner 审批。
- CI 和 review 结果或跳过依据必须对应当前 PR head。没有检查结果、结果过期或存在未解决的阻断问题，都不能合并。
- 流程会记录进度和确认状态，恢复时避免重复创建 issues 或 PR。
- 实际操作由运行时工具执行。这些 Markdown 指令不会替你安装分支保护，也不能保证模型始终遵守每条指令。

## 更新

全局安装的更新命令：

```bash
npx skills@latest update dev-flow -g
```

项目级安装将 `-g` 换成 `-p`，更新后新建 Codex 任务。使用手动克隆版本时仍可执行 `git pull --ff-only`。

包内 Matt skills 固定到同一个上游提交，不会在运行时自动读取 `main`。升级时应比较上游变化，保留流程确认规则，更新版本锁定和来源说明，并验证 skill 元数据及相对路径。

维护者无需安装依赖，即可运行 `npm run check` 和 `npm test`，检查安装包完整性、移动目录后的可用性和缺失文件检测。CI 会在 Windows 和 Linux 上执行相同检查。

## 许可证

MIT，见 [LICENSE](LICENSE)。包内 Matt Pocock 内容保留其版权和 MIT 声明，详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
