variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name used for resource naming"
  type        = string
  default     = "secure-cicd-app"
}

variable "environment" {
  description = "Deployment environment"
  type        = string
  default     = "production"

  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be one of: development, staging, production."
  }
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "ecr_repository_url" {
  description = "ECR repository URL for the application image"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID for the ECS service"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for the ECS service network configuration"
  type        = list(string)
}

variable "desired_count" {
  description = "Number of desired ECS task instances"
  type        = number
  default     = 2
}
