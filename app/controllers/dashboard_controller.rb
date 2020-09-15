class DashboardController < ApplicationController
  before_action :authenticate_user!
  before_action :set_current
  def index
    @calender = Calender.generate(
      date: @current.target_date,
      term: @current.term,
    )
    @stamp = Stamp.find_active_stamp(current_user)
  end

  def stamp
    now = Time.current
    jsonps = []
    if @stamp = Stamp.find_active_stamp(current_user)
      @stamp.out(now)
      @stamp.save!
      jsonps << Jsonp::AddFlashMessage.new("#{now.to_s(:jp_md_hms)} - OUTしました", :notice)
    else
      @stamp = Stamp.new(
        organization_id: current_user.organization_id,
        user_id: current_user.id,
        in_on: now.to_date,
        in_at: now,
      )
      @stamp.save!
      jsonps << Jsonp::AddFlashMessage.new("#{now.to_s(:jp_md_hms)} - INしました", :notice)
    end
    jsonps << Jsonp::ReplaceForm.new(render_to_string(layout: nil, action: :index))
    render_jsonps(jsonps)
  end
end
