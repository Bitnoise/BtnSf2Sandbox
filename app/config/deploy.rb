set :stages,        %w(prod staging)
set :default_stage, "staging"
set :stage_dir,     "app/config/deploy"
require 'capistrano/ext/multistage'
