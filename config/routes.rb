require 'admin_gui/admin_gui'

Rails.application.routes.draw do
  get '/admin/users/sign_in' => redirect('/users/sign_in')
  mount AdminGui => '/admin'
  root 'main#index'
  devise_for :users
  resources :users
  resources :bids
  resources :orders do
    collection do
      get "user_index", defaults: {format: :json}
    end
  end



end
