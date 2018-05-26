class Order < ActiveRecord::Base
  belongs_to :user
  has_many :bids
  after_save :set_bids_status
  after_create :set_default_status
  STATUSES = {booked: 'booked',
              bidded: 'bidded', approved: 'approved',
              before_pickup: 'before_pickup',
              picked_up: 'picked_up',
              delivered: 'delivered',
              cancelled: 'cancelled'}

  def json_attributes
    json = as_json
    json['user'] = user
    json['bids'] = bids.map { |bid| bid.json_attributes }
    json
  end

  def set_bids_status
    unless selected_bid_id.nil?
      over_bids = bids.where.not(id: selected_bid_id)
      over_bids.each do |bid|
        bid.update status: Bid::STATUSES[:over]
      end
      selected_bid = bids.where(id: selected_bid_id).first
      selected_bid.update status: Bid::STATUSES[:selected]
    else
      bids.each do |bid|
        (status == STATUSES[:cancelled])? bid.status = Bid::STATUSES[:cancelled] : bid.status = Bid::STATUSES[:pending]
        bid.save
      end
    end
  end

  def driver
    res = nil
    unless selected_bid_id.nil?
      bid = Bid.find selected_bid_id
      res = bid.user
    end
    return res
  end



  private
  def set_default_status
    self.update status: STATUSES[:booked]
  end

end
