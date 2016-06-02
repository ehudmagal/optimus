require 'pry'

class MainController < ApplicationController

  def index
    redirect_to '/admin'
  end

end
