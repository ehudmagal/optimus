require 'pry'

class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  after_filter :set_csrf_cookie
  respond_to :html, :json
  def set_csrf_cookie
    if protect_against_forgery?
      cookies.permanent['CSRF-TOKEN'] = form_authenticity_token
    end
  end




end
