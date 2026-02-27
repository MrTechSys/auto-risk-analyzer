# Security Policy (SOC 2 Type II Blueprint)

## 1. Security Overview
The Auto Risk Analyzer is designed with a **privacy-first, zero-retention architecture**. No PII (Personally Identifiable Information) or policy data is stored on our servers. All processing and analysis occur within the user's browser.

## 2. Data Classification
| Data Class | Description | Handling |
| :--- | :--- | :--- |
| **Restricted** | Names, VINs, Policy Numbers | Resident in browser memory/Local Storage only. |
| **Confidential** | Coverage limits, Risk Scores | Encrypted in transit (TLS 1.3). |
| **Internal** | Application source code | Access restricted via GitHub IAM. |
| **Public** | Marketing content, educational data | No special handling required. |

## 3. Threat Modeling & Boundary Protection
- **Edge Security**: All traffic is routed through Cloudflare's WAF (Web Application Firewall) with OWASP core rules enabled.
- **Content Security Policy (CSP)**: We enforce a strict CSP via meta tags to prevent XSS and unauthorized data exfiltration.
- **Zero Trust**: Preview deployments and internal tools are protected by Cloudflare Zero Trust (Access).

## 4. Secure SDLC (Software Development Life Cycle)
- **Branch Protection**: Direct pushes to `main` are restricted. Pull Requests require automated security scans to pass.
- **Dependency Auditing**: Automated `npm audit` scans are performed on every build.
- **Static Analysis**: Code is analyzed for patterns indicating secret leakage or insecure logic.

## 5. Incident Response
In the event of a suspected security incident:
1. **Detection**: Alerts triggered by Cloudflare or GitHub security monitors.
2. **Containment**: Instant rollback of deployments via Cloudflare Pages dashboard.
3. **Remediation**: Patches developed in isolated feature branches and verified via CI.
4. **Communication**: Internal stakeholders notified within 4 hours.

## 6. Vulnerability Reporting
Please report any vulnerabilities to security@mrtechsys.com. We do not currently offer a bug bounty, but we acknowledge and remediate all valid reports.
