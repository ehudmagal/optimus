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

  def update
    respond_to do |format|
      format.html {super}
      format.json {
        order = Order.find params['order']['id']
        order.update(params['order'])
        render json: order
      }
    end
  end

  private
  # Using a private method to encapsulate the permissible parameters
  # is just a good pattern since you'll be able to reuse the same
  # permit list between create and update. Also, you can specialize
  # this method with per-user checking of permissible attributes.
  def order_params
    params.require(:order).permit(:source, :destination)
  end

end
