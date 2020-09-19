class StampsController < ApplicationController
  def execute
    now = Time.current
    if user = User.find_by(code: params[:code])
      stamp = Stamp.find_by(
        organization_id: user.organization_id, 
        user_id: user.id,
        date: Date.today
      )
      if stamp&.active?
        stamp.out(now)
        stamp.save!
      else
        stamp ||= Stamp.new(
          organization_id: user.organization_id,
          user_id: user.id,
          date: now.to_date,
        )
        stamp.in(now)
        stamp.save!
      end
    end
    render plain: "ok"
  end
end
