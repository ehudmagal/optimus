require 'admin_gui/admin_gui'
require 'mobile_navigator_gui/mobile_navigator_gui'
Rails.application.routes.draw do
  get '/admin/users/sign_in' => redirect('/users/sign_in')
  get '/mobile_navigator/users/sign_in' => redirect('/users/sign_in')
  mount AdminGui => '/admin'
  mount MobileNavigatorGui => '/mobile_navigator'
  root 'main#index'
  devise_for :users
  ActiveAdmin.routes(self)
  resources :users do
    collection do
      get "num_of_closed_bids_with_user", defaults: {format: :json}
      post "login", defaults: {format: :json}
    end
  end
  resources :bids
  resources :payments do
    collection do
      get "braintree_client_token"
    end
  end
  resources :orders do
    collection do
      get "user_index", defaults: {format: :json}
    end
  end



end
