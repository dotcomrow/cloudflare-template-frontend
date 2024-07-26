variable org_name {
  description = "Organization name"
  type        = string
  nullable = false
}
variable "domain" {
  description = "the domain hosted in cloudflare"
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

variable "project_name" {
  description = "project name"
  type        = string
  nullable    = false
}

variable GCP_LOGGING_PROJECT_ID {
  description = "GCP logging project id"
  type        = string
  nullable = false
}

variable GCP_LOGGING_CREDENTIALS {
  description = "GCP logging credentials"
  type        = string
  nullable = false
}
