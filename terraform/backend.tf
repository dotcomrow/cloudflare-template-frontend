terraform {
  cloud {
    organization = "dotcomrow"

    workspaces {
      name = "template-app-workspace"
    }
  }
}