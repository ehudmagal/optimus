class BidsController < ApplicationController
  before_action :authenticate_user!, :except => [:show, :index]

  def index
    @bids = Bids.all
    render json: @bids.map{|bid| bid.json_attributes}
  end


  def show
    bid = Bid.find(params[:id])
    render bid.json_attributes
  end

  def create
    respond_to do |format|
      format.html {super}
      format.json {
        bid = Bid.create(bid_params)
        render bid.json_attributes
      }
    end
  end

  def update
    respond_to do |format|
      format.html {super}
      format.json {
        bid = Bid.find params['bid']['id']
        bid.update(params['bid'])
        render bid.json_attributes
      }
    end
  end

  private
  def bid_params
    params.require(:bid).permit(:user_id, :order_id, :price)
  end


end