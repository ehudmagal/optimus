class OrdersController < ApplicationController
  before_action :authenticate_user!, :except => [:show, :index]

  def index
    @orders = Order.all
    render json: @orders.map{|order| order.json_attributes}
  end
  def user_index
    orders = Order.where(user_id: current_user.id)
    render json: orders.map{|order| order.json_attributes}
  end

  def show
    @order = Order.find(params[:id])
    render json: @order
  end

  def create
    respond_to do |format|
      format.html {super}
      format.json {
        order = Order.create(order_params)
        order.update(user_id: current_user.id,
                     source: params['order']['source'],
                     destination: params['order']['destination'])
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
  def order_params
    params.require(:order).permit(:source, :destination)
  end

end
