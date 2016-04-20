require 'sinatra/base'
require 'open3'

class AdminGui < Sinatra::Base
  BACKUP_TIMEOUT_SECONDS = 120

  configure do
    set :app_file, __FILE__
    enable :static
    set :root, File.dirname(__FILE__)
    set :public_folder, File.dirname(__FILE__) + '/admin'
  end

# serve the files!

# route to starting page (index.html)
  get "/" do
    send_file File.join(settings.public_folder, '/index.html')
  end

  not_found do
    redirect '/404.html'
  end
end
