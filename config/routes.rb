require 'admin_gui/admin_gui'

Rails.application.routes.draw do
  get '/admin/users/sign_in' => redirect('/users/sign_in')
  root to: 'visitors#index'
  devise_for :users
  resources :users
  resources :orders
  mount AdminGui => '/admin'
end
