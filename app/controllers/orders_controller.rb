class OrdersController < ApplicationController
  before_action :authenticate_user!, :except => [:show, :index]

  def index
    @orders = Order.all
    render json: @orders
  end

  def show
    @order = Order.find(params[:id])
    render json: @order
  end

  def create
    respond_to do |format|
      format.html {super}
      format.json {
        order = Order.create(params['order'])
        order.update(user_id: current_user.id)
        render json: order
      }
    end
  end

end
