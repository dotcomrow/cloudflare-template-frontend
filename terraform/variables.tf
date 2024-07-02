
variable "domain" {
  description = "app domain hosted in cloudflare"
  type        = string
  nullable    = false
}

variable "cloudflare_token" {
  description = "cloudflare token"
  type        = string
  nullable    = false
}

variable "cloudflare_account_id" {
  description = "Cloudflare account id"
  type        = string
  nullable    = false
}

variable "cloudflare_zone_id" {
  description = "cloudflare worker zone id"
  type        = string
  nullable    = false
}

variable "user_profile_svc_endpoint" {
  description = "user profile svc url"
  type        = string
  nullable    = false
}

variable "project_name" {
  description = "project name"
  type        = string
  nullable    = false
}
