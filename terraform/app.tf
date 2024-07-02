locals {
  project_name = "${var.project_name}"
}

resource "cloudflare_pages_domain" "app" {
  account_id   = var.cloudflare_account_id
  project_name = local.project_name
  domain       = "${local.project_name}.${var.domain}"

  depends_on = [cloudflare_pages_project.app]
}

resource "cloudflare_record" "app" {
  zone_id         = var.cloudflare_zone_id
  name            = local.project_name
  value           = cloudflare_pages_project.app.domains[0]
  type            = "CNAME"
  ttl             = 3600
  allow_overwrite = true
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = local.project_name
  production_branch = "gh-pages"
  source {
    type = "github"
    config {
      owner                         = "dotcomrow"
      repo_name                     = local.project_name
      production_branch             = "gh-pages"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "none"
    }
  }

  deployment_configs {
    production {

    }
  }
}
