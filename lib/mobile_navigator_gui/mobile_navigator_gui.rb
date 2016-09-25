require 'sinatra/base'

class MobileNavigatorGui < Sinatra::Base

  configure do
    set :app_file, __FILE__
    enable :static
    set :root, File.dirname(__FILE__)
    set :public_folder, File.dirname(__FILE__) + '/mobile_navigator'
  end

  # serve the files!

  # route to starting page (index.html)
  get "/" do
    send_file File.join(settings.public_folder, '/index.html')
  end

  # route to custom error page (404.html)
  not_found do
    redirect '/404.html'
  end
end