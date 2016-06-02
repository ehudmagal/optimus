require 'admin_gui/admin_gui'

Rails.application.routes.draw do
  get '/admin/users/sign_in' => redirect('/users/sign_in')
  root to: '/admin'
  devise_for :users
  resources :users
  resources :orders do
    collection do
      get "user_index", defaults: {format: :json}
    end
  end

  mount AdminGui => '/admin'

end
