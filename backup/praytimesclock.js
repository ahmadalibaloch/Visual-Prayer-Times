function Drawings(date,latitude,longitude,timeZone,drawingContext,center,radius, piesWidth,clkStartAngle,clkStartPie,clkDrawRef)
{
	//var calcs = new Calculations();
	var date = date || new Date();//today
	var lat = latitude || 32.7850;
	var lon =  longitude || 71.7803;
	var timeZone =  timeZone || +5;
	var c = drawingContext || document.getElementById('diagonal').getContext('2d');;
	c.lineJoin = "round";
	c.translate(diagonal.width/2,diagonal.height/2);
	
	prayTime.setCalcMethod(1);
	prayTime.setAsrMethod(1);

	var times = prayTime.getPrayerTimes(date, lat , lon, timeZone);
	//============================================>Drawings
	//	---->settings
	var centerPoint = center || [0,-50];
	var clkRadius = radius || 160;
	var clkPieWidth = piesWidth || 75;
	var clkStartAngle = normalizeAngle(clkStartAngle);
	var clkDrawRef = clkDrawRef||0;	
	var clkStartPie =clkDrawRef==0?clkStartPie=7:clkStartPie|| 1;
	var colorsArray = ["gray","#FFCC99","#FF9900","#CCCC00","#996666","#999999","#777777","#666666"];
	var pNamesArray = ["Fajir","Sunrise","Zohar","Aser","Sunset","Maghrib","Isha"];
	var pieNamesArray = ["Fajir","Day","Zohar","Aser","","Maghrib","Isha","Night"];
	var Pies = [];
	//============================================>Properties
	this.getDate = function()
	{
		return date;
	}
	this.getLatitude = function()
	{
		return lat;
	}
	this.getLongitude = function()
	{
		return lon;
	}
	this.getTimeZone = function()
	{
		return timeZone;
	}
	//============================================>Drawing Methods
	this.drawClock = function()
	{
		this.drawPies();
		this.drawRulers(false,true);
		//drawSunHand();
		this.drawSun();
		this.drawClockNumbers(true);
		this.drawDayNight([-225,215],20,10);
	}
	function drawBox(corner,width,height,gradientColorArray,shadow)
	{
	c.beginPath();
	c.moveTo(corner[0],corner[1]);
	c.lineTo(corner[0]+width,corner[1]);
	c.lineTo(corner[0]+width,corner[1]+height);
	c.lineTo(corner[0],corner[1]+height);
	c.closePath();
	var lingrad = c.createLinearGradient(corner[0],corner[1],corner[0]+width,corner[1]+height);
	if(gradientColorArray)
			for(i=0;i<=gradientColorArray.length-1;i++)
				lingrad.addColorStop(gradientColorArray[i][0],gradientColorArray[i][1]);
	else
	{
		lingrad.addColorStop(0, '#fff');
		lingrad.addColorStop(0.5, '#00ABEB');
		lingrad.addColorStop(0.9, '#00ABEB');
		lingrad.addColorStop(1, '#66ccff');
	}
	c.fillStyle=lingrad;
	if(shadow)
	{c.shadowColor = "#bbbbbb";
	c.shadowBlur = 20;
	c.shadowOffsetX = 3;
	c.shadowOffsetY = 3;
	}
	c.fill();
	c.shadowColor = "#bbbbbb";
	c.shadowBlur = 0;
	c.shadowOffsetX = 0;
	c.shadowOffsetY = 0;
	};
	function drawPie(center,radius,width,startAngle,sweepAngle,color)
	{
		c.beginPath();
		startAngle=normalizeAngle(startAngle);
		sweepAngle=normalizeAngle(sweepAngle);
		//c.moveTo(center[0],center[1]);
		c.arc(center[0],center[1],radius+width,deg2rad(startAngle),deg2rad(startAngle+sweepAngle),false);//
		c.arc(center[0],center[1],radius,deg2rad(startAngle+sweepAngle),deg2rad(startAngle),true);//
		c.closePath();
		c.fillStyle = color;
		c.fill();
	};
	this.drawPies = function ()
	{
		drawBox([-diagonal.width/2,-diagonal.height/2],diagonal.width,diagonal.height,LGA,false);
		Pies = GetPieDataWithAngle(getPrayerMinutes(),clkStartAngle,clkStartPie);
		for(i=0;i<=7;i++)
		{
			drawPie(centerPoint,clkRadius,clkPieWidth,Pies[i][0],Pies[i][1],colorsArray[i]);
			drawText(getEndLinePoint(centerPoint,clkRadius+clkPieWidth/2,Pies[i][0]+Pies[i][1]/2),pieNamesArray[i],10,"#eeeeee",true);
		}
	};
	this.drawClockNumbers = function(clockType24)
	{
		hNightAngle = halfNightAngle() ;
		if(clockType24)
		{
			for (i = 0; i <= 95; i += 4)
			{
				drawText(getEndLinePoint([centerPoint[0],centerPoint[1]],clkRadius+clkPieWidth*0.7,hNightAngle+ i * 3.75),(i / 4).toString(),10,"white",true);
			}
		}
		else
		{
			for (i = 0; i <= 30; i += 12)
			{
				drawText(getEndLinePoint([centerPoint[0],centerPoint[1]],clkRadius+clkPieWidth*0.7,hNightAngle+ i * 3.75),(i / 4).toString(),10,"white",true);
			}
		}
	};
	this.drawRulers = function (small,big)
	{
		var hAngle = halfNightAngle();
		c.beginPath();
		for (i = 0; i < 96; i ++)
		{
			linePoints = getSizeLinePoints(centerPoint, clkRadius, clkPieWidth/4,  hAngle+i * 3.75);//the first ruler line angle starts from HalfNightAnlge+number of line *3.75 for 96 lines as 96*3.75=360
			if (i % 4 != 0 && small)
			{
					c.moveTo(linePoints[0][0], linePoints[0][1]);
					c.lineTo(linePoints[1][0], linePoints[1][1]);
			}
			else
			{
						if(big && (i % 4 == 0))
						{
							linePoints = getSizeLinePoints(centerPoint, clkRadius, clkPieWidth/2,hAngle+i * 3.75);
							c.moveTo(linePoints[0][0], linePoints[0][1]);
							c.lineTo(linePoints[1][0], linePoints[1][1]);			
						}
						else if(big && small)
						{
							linePoints = getSizeLinePoints(centerPoint, clkRadius, clkPieWidth/2,hAngle+i * 3.75);
							c.moveTo(linePoints[0][0], linePoints[0][1]);
							c.lineTo(linePoints[1][0], linePoints[1][1]);			
						}
						else if(small && !big)
						{
						c.moveTo(linePoints[0][0], linePoints[0][1]);
						c.lineTo(linePoints[1][0], linePoints[1][1]);
						}
					}
		}
		c.closePath();
		c.strokeStyle="brown";
		c.stroke();
	};
	this.drawDayNight = function(corner,width,passedWidth)
	{
		var x=corner[0],y=corner[1];
		var dayTime, nightTime, passedDay, passedNight;
		var sunset=getPrayerTimes()[5],sunrise=getPrayerTimes()[1];
		dayTime = TDayMin(sunset,sunrise);
		nightTime=TNightMin(sunset,sunrise);
		//Ruler Lines
		drawText([x-40,y-5],"Hours",10,"Black",false);
		drawBox([x,y],480,1,[[1,"#000000"]],true);//line for 16 hours, 30pix for an hour,16x30=480
		c.beginPath();
		var x1=x;
		for(i=0;i<=16;i++)//drawing ruler lines
		{
		x1=x+i*30;//30pix for an hour;
		c.moveTo(x1,y);
		c.lineTo(x1,y+10);
		drawText([x1,y-5],i.toString(),10,"black",true);
		c.moveTo(x1,y);
		}
		c.closePath();
		c.stroke();
		//DayNight Lines
		drawText([x-40,y+20],"Day",10,"Black",false);
		drawBox([x,y+15],dayTime/2,width,[[0,"#aabbcc"],[1,"#bbccdd"]],false);//Day
		drawBox([x,y+20],PDayMin(sunset,sunrise)/2,passedWidth,[[1,"#FF6600"]],false);//passed Day
		drawText([x-40,y+50],"Night",10,"Black",false);
		drawBox([x,y+45],nightTime/2,width,[[1,"#bbccdd"],[0,"#aabbcc"]],false);//Night
		drawBox([x,y+50],PNightMin(sunset,sunrise)/2,passedWidth,[[1,"#FF6600"]],false);//passed Night
		//END
	}
	this.drawSun = function (time, startAngle,gradientArray)
	{
	var now = new Date();
	var sunAngle = timeAngle(time || now.toTimeString().substring(0,5),startAngle || clkStartAngle);
	var circlePoint = getEndLinePoint(centerPoint,clkRadius*0.9,sunAngle);
	c.beginPath();
	c.arc(circlePoint[0],circlePoint[1],clkPieWidth*0.16,deg2rad(sunAngle),2*Math.PI*2,true);
	var grd = c.createRadialGradient(circlePoint[0], circlePoint[1], 0, circlePoint[0], circlePoint[1], 80);
	var gArray = gradientArray || [[0,'yellow'],[0.4,'red'],[0.6,'orange'],[0.7,'green'],[0.8,'blue'],[1,'violer']];
	for(i=0;i<5;i++)
	grd.addColorStop(gArray[i][0],gArray[i][1]);
	c.fillStyle = grd;
	c.fill();
	};
	function drawText(point, text,size,color,ifCenter)
	{
	
		var font = "Bold "+size+"px Sans-Serif";
		c.font = font;
		var fontSize = Number(font.substring(5,7));
		c.fillStyle=color;
		if(ifCenter)
		c.fillText(text, point[0]-text.length*fontSize*0.26, point[1]+fontSize*1/3); 
		else
		c.fillText(text, point[0], point[1]+fontSize); 
	}
	//Calculation methods
	function normalizeAngle(angle)
	{
		if(angle<0)
		return normalizeAngle(angle+360);
		else
		return angle > 360 ? (angle % 360): angle;
	}
	function getEndLinePoint (startPoint, lengthPixels, angleDegrees)//A method to return end point after adding lenght in a given angle to a point
	{
		var newx = Math.round(lengthPixels * Math.cos((angleDegrees * Math.PI) / 180.0));
		var newy = Math.round(lengthPixels * Math.sin((angleDegrees * Math.PI) / 180.0));
		//return new PointF(((float)startPoint.X) + ((float)newPointx), ((float)startPoint.Y) + ((float)newPointy));
		//return {x:newx,y:newy};
		return [startPoint[0]+newx,startPoint[1]+newy];
	}
	function getSizeLinePoints(center, radius, length, angleDegrees)
	{
	var start=[], end=[];
	start = getEndLinePoint(center, radius, angleDegrees);
	end = getEndLinePoint(start, length, angleDegrees);
	return [[start[0],start[1]], [end[0],end[1]]];
	}
	function getPrayerMinutes()
	{
		var times =[];
		var dt =[];
		dt= getPrayerTimes();
		var ts1 = new TimeSpan();
		var date1 = new Date();
		var date = new Date();
		
		for( i=0;i<=5;i++)
		{
			date1.setHours(getH(dt[i+1]))
			date1.setMinutes(getM(dt[i+1]));

			date.setHours(getH(dt[i]))
			date.setMinutes(getM(dt[i]));
			var ts = new TimeSpan.FromDates(date,date1);
			times[i]=ts.totalMinutes();
		}
		times[7] =  getH(dt[0])*60+Math.round(getM(dt[0]));//times7=12am to fajir,
		times[6] = TNightMin(dt[5],dt[1]) - (times[7]+times[0]+times[5]);//time0=fajir to sunrise,time5=sunset to isha
		return times;
	}
	function getH(time)
	{
	return time.substring(0,2);
	}
	function getM(time)
	{
	return time.substring(3,5);
	}
	function TNightMin(sunset, sunrise)
	{
		var Sunset = new TimeSpan();
		Sunset.addHours(getH(sunset));
		Sunset.addMinutes(getM(sunset));
		
		var Sunrise = new TimeSpan();
		Sunrise.addHours(getH(sunrise));
		Sunrise.addMinutes(getM(sunrise));

		var zero00 = new TimeSpan();
		zero00.addHours(23);
		zero00.addMinutes(59);
		zero00.addSeconds(59);
		
		var ts= new TimeSpan();
		zero00.subtract(Sunset);
		zero00.add(Sunrise);
		return Math.round(zero00.totalMinutes());
	}
	function TDayMin(sunset,sunrise)
	{
		var sunSet= new TimeSpan();sunRise = new TimeSpan();
		sunSet.addHours(getH(sunset));sunSet.addMinutes(getM(sunset));
		sunRise.addHours(getH(sunrise));sunRise.addMinutes(getM(sunrise));

		sunSet.subtract(sunRise);
		return Math.round(sunSet.totalMinutes());
	}
	function PNightMin(sunset,sunrise)
	{
	//Passed NightPin
		var now = new Date();
		var sunsetDt = new Date();
		sunsetDt.setHours(getH(sunset));sunsetDt.setMinutes(getM(sunset));
		var sunriseDt = new Date();
		sunriseDt.setHours(getH(sunrise));sunriseDt.setMinutes(getM(sunrise));
		
		sun00 = new TimeSpan();Now = new TimeSpan();sunSet = new TimeSpan();
		sun00.addHours(23);sun00.addMinutes(59);sun00.addSeconds(59);
		sunSet.addHours(getH(sunset));sunSet.addMinutes(getM(sunset));
		Now.addHours(now.getHours());Now.addMinutes(now.getMinutes());
	
		
		if(now>sunsetDt)
		{
			Now.subtract(sunSet);
			return Math.round(Now.totalMinutes());
		}
		else if(now < sunriseDt)			
		{	
			sun00.subtract(sunSet);
			var firstNight = sun00.totalMinutes();
			return Math.round(Now.totalMinutes()+firstNight);
		}
		return 0;
	}
	function PDayMin(sunset,sunrise)
	{
		var now = new Date();
		var sunsetDt = new Date();
		sunsetDt.setHours(getH(sunset));sunsetDt.setMinutes(getM(sunset));
		var sunriseDt = new Date();
		sunriseDt.setHours(getH(sunrise));sunriseDt.setMinutes(getM(sunrise));
		sunRise = new TimeSpan();Now = new TimeSpan();
		sunRise.addHours(getH(sunrise));sunRise.addMinutes(getM(sunrise));
		Now.addHours(now.getHours());Now.addMinutes(now.getMinutes());
		if(now < sunsetDt && now > sunriseDt)
		{
			Now.subtract(sunRise);
			return Math.round(Now.totalMinutes());
		}
		return 0;
	}
	
	function getPrayerTimes()
	{
		return prayTime.getPrayerTimes(date, latitude , longitude, timeZone);
	}
	function GetPieDataWithAngle (values, startAngle, startAnglePie)
	{
	
		var sum = 0, mutiplier, MinusAngleValue = 0;
		var length = values.length;
		for (i = 0; i < length; i++)
		{
			sum += values[i];
			//alert(values[i]);
		}
		//alert(sum);
		mutiplier = 360 / 1440;//sum;
		for (i = 0; i <= startAnglePie - 1; i++)
		{
			MinusAngleValue += values[i] * mutiplier;
		}
		startAngle = startAngle - MinusAngleValue;//the value of sweep angles minueses from startangle
		return getPieData(values, startAngle);
	}
	function getPieData(values, startAngle)
	{
		var sum=0,
		length = values.length,
		angleStarts = [],
		angleSweeps = [],
		result = [], //multi dimensional array
		i;
		
		for (i = 0; i < length; i++)
		{
			sum += values[i];
		}
		
		mutiplier = 360 / sum; angleStarts[0] = startAngle;
		
		for (i = 0; i < length; i++)
		{
			angleSweeps[i] = values[i] * mutiplier;
			
			if ((i + 1) < length) angleStarts[i + 1] = angleStarts[i] + angleSweeps[i];
			
			result[i]= [normalizeAngle(angleStarts[i]), normalizeAngle(angleSweeps[i])];
		}
		
		return result;
	}
	function deg2rad(degree)
	{	
		return normalizeAngle(degree)*0.017453292519943295 //360=2P
	}
	function halfNightAngle()
	{
	 return timeAngle("24:00",clkStartAngle);
	}
	function timeAngle(time,startAngle)
	{
	    var totalMinutes;
		var ts = new TimeSpan();
		ts.addHours(getH(time));
		ts.addMinutes(getM(time));
		if (clkDrawRef == 0)
			{
				totalMinutes = ts.totalMinutes();//This is general time angle
				
			}
		else//this is special timeangle which fits the hand in reference to pies.
		{
			totalMinutes = ts.totalMinutes();
			if (clkStartPie != 7)
			{
				totalMinutes -= getPrayerMinutes()[7];//totalMinutes -= this.getPrayerMinutes()[m];condition clkStartAngle+1;
				var i=clkStartPie;
				while(i >= 1)
				{
				//alert(i+" totalMinutes"+totalMinutes);
				totalMinutes -= getPrayerMinutes()[i-1];
				i--;
				}
			}
		}
		totalMinutes /= 4;//so 60/4=15 hence. 15 deg for 1 hour. and 360 for 24 hours. 
		//totalMinutes += 90.0;//because C# starts angle from +horizontal line but above formula starts 0 degree from +vertical line
		totalMinutes += startAngle;
		totalMinutes = normalizeAngle(totalMinutes);
		return totalMinutes;
	}
}