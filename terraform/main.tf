
module "user-preferences-svc" {
  source  = "../services/preferences"
  cloudflare_account_id = "${var.cloudflare_account_id}"
  cloudflare_worker_hostname = "user-prefs.${var.domain}"
  cloudflare_worker_url_pattern = "user-prefs.${var.domain}/*"
  cloudflare_worker_zone_id = "${var.cloudflare_zone_id}"
  cloudflare_cors_domains = ".*.${var.domain},.*localhost.*"
  user_profile_svc_url = "${var.user_profile_svc_endpoint}"
}

