#Common deployment flow

set :php_bin,     "php"
set :repository,  "git@github.com:Bitnoise/BtnSf2Sandbox.git"
set :scm,         :git
set :use_composer, true
set :update_assets_version, true

set :model_manager, "doctrine"


role :web,        domain                         # Your HTTP server, Apache/etc
role :app,        domain                         # This may be the same as your `Web` server
role :db,         domain, :primary => true       # This is where Symfony2 migrations will run

set :use_sudo,      false
set :keep_releases,  2
set :deploy_via, :remote_cache


set :shared_children,     [app_path + "/logs", web_path + "/uploads", "vendor"]
set :clear_controllers, false #if we need dev on deploy, comment this out on production deploy

#permissions
set :writable_dirs,       ["app/cache", "app/logs"]
set :webserver_user,      "www-data"
# set :use_set_permissions, true
# set :permission_method,   :chown

# perform tasks after deploying
after "deploy" do
  # dump assets (if using assetic) // DEPRACATED - use grunt dump for it
  #run "cd #{deploy_to}/current && php app/console assetic:dump --env=prod --no-debug"

  # db update
  run "cd #{deploy_to}/current && #{php_bin} app/console doctrine:schema:update --force"

  # Make app.php the front controller (and not app_dev.php)
  # in order not to have to change the htaccess manualyy everytime
  run "sed -i 's/app_dev/app/' #{deploy_to}/current/web/.htaccess"
  # Remove conditional comments from .htaccess
  run "sed -i 's/#If#{stage.to_s.capitalize} //' #{deploy_to}/current/web/.htaccess"
end

# Be more verbose by uncommenting the following line
logger.level = Logger::MAX_LEVEL

# Custom tasks
task :upload_parameters do
  origin_file = "app/config/parameters_#{stage}.yml"
  destination_file = latest_release + "/app/config/parameters.yml" # Notice the latest_release

  try_sudo "mkdir -p #{File.dirname(destination_file)}"
  top.upload(origin_file, destination_file)
end

task :upload_assets do
  desc "Upload assets to the stage"
  #dump locally
  system("php app/console --no-ansi --no-interaction --env=prod assetic:dump")
  system("grunt dump")

  #send the files to the server
  dirs = ['js', 'css']
  #loop them
  dirs.each do |dir|
    origin_dir = "web/" + dir
    destination_dir = latest_release + "/web/" # Notice the latest_release
    try_sudo "mkdir -p #{destination_dir}"
    top.upload(origin_dir, destination_dir, {:recursive => true, :via => :scp})
  end

  #clean locally
  system("grunt clean")
end

# hooks
before "deploy:share_childs", "upload_parameters"

after "deploy:update", "deploy:cleanup"

after "deploy:finalize_update", "upload_assets", "symfony:cache:clear"

#TODO - add mkdir uploads task:
#mkdir -p uploads/avatar/user
#root@localhost:/var/www/dev/petbnc/current/web# mkdir -p uploads/avatar/pet
#root@localhost:/var/www/dev/petbnc/current/web# mkdir -p uploads/gallery
#root@localhost:/var/www/dev/petbnc/current/web# chmod -R 1777 uploads
#after "deploy:finalize_update", "upload_assets"
