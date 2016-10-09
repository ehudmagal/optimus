class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    if user.active_adminable?
      can :manage, :all
    else
      #orders
      can :manage, Order
      #bids
      can :manage, Bid
      #user
      can :manage, User
    end
  end
end
