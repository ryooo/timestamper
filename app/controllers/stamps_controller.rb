class StampsController < ApplicationController
  def execute
    now = Time.current
    if user = User.find_by(code: params[:code])
      stamps = Stamp.where(user_id: user.id, in_on: Date.today)
      if actice_stamp = stamps&.detect {|stamp| stamp.active?}
        actice_stamp.out(now)
        actice_stamp.save!
      else
        actice_stamp = Stamp.new(
          organization_id: user.organization_id,
          user_id: user.id,
          in_on: now.to_date,
          in_at: now,
        )
        actice_stamp.save!
      end
    end
    render plain: "ok"
  end
end
