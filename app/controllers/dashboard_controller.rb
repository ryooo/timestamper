class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
    @current_stamp = Stamp.find_active_stamp(current_user)
    @stamp_date_map = {
      Date.today => Stamp.find_by_user_and_in_on(current_user, Date.today),
    }
  end

  def stamp
    now = Time.current
    jsonps = []
    if @stamp = Stamp.find_active_stamp(current_user)
      @stamp.out(now)
      @stamp.save!
      flash[:flash_message] = {
        type: :notice,
        icon: :"fa-check-circle",
        message: "#{now.to_s(:jp_md_hms)} - OUTしました",
      }
    else
      @stamp = Stamp.new(
        organization_id: current_user.organization_id,
        user_id: current_user.id,
        in_on: now.to_date,
        in_at: now,
      )
      @stamp.save!
      flash[:flash_message] = {
        type: :notice,
        icon: :"fa-check-circle",
        message: "#{now.to_s(:jp_md_hms)} - INしました",
      }
    end
    redirect_to action: :index
  end
end
