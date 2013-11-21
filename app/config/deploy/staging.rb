set :application, "" #BtnSf2Sandbox
set :domain,      "" #{}"dev.bitnoi.se"
set :deploy_to,   "" #"/var/www/dev/#{application}"
set :app_path,    "app"
set :user, "root" #ssh user

load "#{stage_dir}/common"
