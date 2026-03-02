# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - button "Open Next.js Dev Tools" [ref=e8] [cursor=pointer]:
    - img [ref=e9]
  - alert [ref=e12]
  - generic [ref=e14]:
    - heading "Sign In" [level=1] [ref=e15]
    - paragraph [ref=e16]: Log in to continue your SF-86 submission.
    - generic [ref=e17]:
      - generic [ref=e18]:
        - generic [ref=e19]: Email
        - textbox "Email" [ref=e20]
      - generic [ref=e21]:
        - generic [ref=e22]: Password
        - textbox "Password" [ref=e23]
      - button "Sign In" [ref=e24]
    - paragraph [ref=e25]:
      - text: No account?
      - link "Register" [ref=e26] [cursor=pointer]:
        - /url: /register
```