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

resource "cloudflare_d1_database" "prod_configuration" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}_prod_config_database"
}

resource "cloudflare_d1_database" "dev_configuration" {
  account_id = var.cloudflare_account_id
  name       = "${var.project_name}_dev_config_database"
}

resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "prod"
  source {
    type = "github"
    config {
      owner                         = var.org_name
      repo_name                     = var.project_name
      production_branch             = "prod"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
      preview_deployment_setting    = "all"
      preview_branch_excludes       = [ "prod"]
    }
  }

  build_config {
    build_command       = "npm run build"
    destination_dir     = "build"
  }

  deployment_configs {
    production {
        environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_app_log"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        d1_databases = {
          CONFIGURATION = cloudflare_d1_database.prod_configuration.id
        }
    }

    preview {
      environment_variables = {
          GCP_LOGGING_PROJECT_ID = var.GCP_LOGGING_PROJECT_ID
          LOG_NAME = "${var.project_name}_app_log"
        }

        secrets = {
          GCP_LOGGING_CREDENTIALS = var.GCP_LOGGING_CREDENTIALS
        }

        d1_databases = {
          CONFIGURATION = cloudflare_d1_database.dev_configuration.id
        }
    }
  }
}
