class TutorialsController < ApplicationController
  layout "tutorial"
  before_action :authenticate_user!

  def locations_create
    present_names = current_user.organization.locations.map(&:name)
    params[:locations].each do |h|
      if (name = h[:name]).present?
        # repost対応
        unless present_names.include?(name)
          Location.create(
            organization_id: current_user.organization.id,
            name: name,
          )
        end
      end
    end
    redirect_to action: :positions
  end

  def positions_create
    present_names = current_user.organization.positions.map(&:name)
    params[:positions].each do |h|
      if (name = h[:name]).present?
        # repost対応
        unless present_names.include?(name)
          Position.create(
            organization_id: current_user.organization.id,
            name: name,
          )
        end
      end
    end
    redirect_to action: :members
  end

  def members_create
    present_names = current_user.organization.users.map(&:name)
    present_position_ids = current_user.organization.positions.map(&:id)
    params[:members].each do |h|
      if (name = h[:name]).present?
        # repost対応
        unless present_names.include?(name)
          position_ids = (h[:selected_position_ids] || []).map(&:to_i).select {|id| id.in?(present_position_ids)}
          u = User.new(
            organization_code: current_user.organization.code,
            name: name,
            position_ids: position_ids
          )
          u.save!
        end
      end
    end
    redirect_to users_path
  end
end
