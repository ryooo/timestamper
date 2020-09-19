class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
    @stamp = Stamp.find_by(user_id: current_user.id, date: Date.today)
    @stamps = {Date.today => @stamp}
  end

  def stamp
    now = Time.current
    jsonps = []
    @stamp = Stamp.find_or_create_by(
      organization_id: current_user.organization_id,
      user_id: current_user.id,
      date: Date.today,
    )
    act = if @stamp.active?
      @stamp.out(now)
      :out
    else
      @stamp.in(now)
      :in
    end
    @stamp.save!
    flash[:flash_message] = {
      type: :notice,
      icon: :"fa-check-circle",
      message: "#{now.to_s(:jp_md_hms)} - #{act}しました",
    }
    redirect_to action: :index
  end
end
