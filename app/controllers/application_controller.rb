require 'pry'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  before_filter :configure_permitted_parameters, if: :devise_controller?
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie
  after_filter :set_cookie_params_user
  respond_to :html, :json

  def set_csrf_cookie
    if protect_against_forgery?
      cookies.permanent['CSRF-TOKEN'] = form_authenticity_token
    end
  end

  def set_cookie_params_user
    if user_signed_in?
      cookies[:user_name] = current_user.name
      cookies[:user_email] = current_user.email
      cookies[:user_role] = current_user.role
      cookies[:user_id] = current_user.id
    else
      cookies[:user_name] = nil
      cookies[:user_email] = nil
      cookies[:user_role] = nil
    end

  end

  protected
  
  def configure_permitted_parameters
    registration_params = [:email, :name, :password, :password_confirmation, :role]
    devise_parameter_sanitizer.for(:sign_up) { |u| u.permit(registration_params) }
  end


end
