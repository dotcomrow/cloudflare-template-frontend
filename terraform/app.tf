resource "cloudflare_pages_domain" "app" {
  account_id   = var.cloudflare_account_id
  project_name = var.project_name
  domain       = "${var.project_name}.${var.domain}"

  depends_on = [cloudflare_pages_project.app]
}

resource "cloudflare_record" "app" {
  zone_id         = var.cloudflare_zone_id
  name            = var.project_name
  value           = cloudflare_pages_project.app.domains[0]
  type            = "CNAME"
  ttl             = 3600
  allow_overwrite = true
}

resource "cloudflare_worker_script" "project_script" {
  account_id         = var.cloudflare_account_id
  name               = var.project_name
  content            = file("${path.module}/loader.js")
  compatibility_date = "2023-08-28"
  module             = true

}

resource "cloudflare_pages_project" "build_config" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "prod"
  build_config {
    build_command       = "npm run build"
    destination_dir     = "build"
    root_dir            = ""
  }
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "prod"
  source {
    type = "github"
    config {
      owner                         = "dotcomrow"
      repo_name                     = var.project_name
      production_branch             = "prod"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "custom"
      preview_branch_includes       = ["dev"]
      preview_branch_excludes       = [ "prod"]
    }
  }

  deployment_configs {
    production {
      service_binding {
        name = "CONFIGS"
        service = cloudflare_worker_script.project_script.name
      }
    }

    preview {
      service_binding {
        name = "CONFIGS"
        service = cloudflare_worker_script.project_script.name
      }
    }
  }
}
