var questionsCounter = 0;
var questionNumber = 0;
var quizScore = 0;

$(document).ready(function() {
	$.ajax({
		url: 'topScore.php',
		type: 'post',
		data: {
		},
		success: function(result) {
			topScoreResult = JSON.parse(result);
			topScoreResult.sort(function(a, b){return b.quizScore - a.quizScore});
			
			if (topScoreResult.length > 0) {
				for (var i=0;i<topScoreResult.length;i++) {
					if (i < 3) {
						p = i + 1;
						$('.section-body').append('<div class="row-wrapper"><span class="top-score-number">#'+p+'</span><span class="score-span"><span class="date-span">on '+topScoreResult[i].quizDate+'</span><br /><span class="result-span">'+formatNumber(topScoreResult[i].quizScore)+' pts</span></span></div>');
					}
				}
			}
			
		}
	});
});

$(document).on('click', '.home-button', function() {
	location.reload();
});

$(document).on('click', '.start-quiz', function() {
	$('.home-button').hide();
	$('.start-quiz').hide();
	$('.next-question').hide();
	$('.footer').removeClass('footer-top-padding');

	var resultArr = [];
	
	if (questionsCounter < 5) {
	
		$.ajax({
			url: 'jsonResponse.php',
			type: 'post',
			data: {
			},
			success: function(result) {
				parsedResult = JSON.parse(result);
				
				questionAnswersCounter = 0;
				
				for (var i=0;i<parsedResult.length;i++) {
					if (questionAnswersCounter < 3) {
						var randomValue = parsedResult[Math.floor(Math.random() * parsedResult.length)];
						
						if (resultArr.length > 0) {
							alreadyAddedValueCounter = 0;
							for (var j=0;j<resultArr.length;j++) {							
								if (resultArr[j].continent == randomValue.continent) {
									alreadyAddedValueCounter++;
								}
							} 
							if (alreadyAddedValueCounter == 0) {
								resultArr.push(randomValue);
								questionAnswersCounter++;
							}
						} else {
							resultArr.push(randomValue);
							questionAnswersCounter++;
						}
					}
				}

				$('.section-title').html('<h2>Question '+questionNumber+' of 5</h2>');
				$('.section-body').html('');
				$('.section-body').append('<div class="answers-wrapper"></div>');

				for (var i=0;i<resultArr.length;i++) {
					if (i == 0) {
						var randomImage = resultArr[Math.floor(Math.random() * resultArr.length)];
						var img = '<div class="image-section" data-src='+randomImage.image+'><img src='+randomImage.image+' width="100%" height="500px" /></div>';
						$('.section-body').prepend(img);
					}
					
					var continent = '<div class="answers-section"><button class="answer-continent" data-attr='+resultArr[i].image+'><img class="filter-orange" src="media/category.svg" width="50px" height="50px" /> '+resultArr[i].continent+'</button></div>';
					$('.answers-wrapper').append(continent);
				}
			}
		});
		
		questionsCounter++;
		questionNumber++;
	
	} else {
		
		$('.section-title').html('');
		$('.section-body').html('');
		
		$('.section-title').html('<h1>Results</h1>');
		
		resultString = '';
		
		resultString += '<div class="result-data">'+
											'<div class="result-data-text"><h2>Your result<h2></div>'+
											'<div class="quiz-result" data-score="'+quizScore+'">'+formatNumber(quizScore)+' pts</div>'+
										'</div>';
		
		$('.section-body').append('<div class="image-section"><img class="filter-blue" src="media/category.svg" width="400px" height="400px" /></div>');
		$('.section-body').append(resultString);
		$('.finish-quiz').show();
		
	}
	
});

$(document).on('click', '.next-question', function() {
	$('.start-quiz').click();
});

$(document).on('click', '.answer-continent', function() {
	var imagePathFromButton = $(this).attr('data-attr');
	var imagePathFromImage = $('.image-section').attr('data-src');
	
	$(this).css({'backgroundColor': '#FFA500', 'color': '#fff'});
	$(this)[0].childNodes[0].className = 'filter-white';
	
	if (imagePathFromButton == imagePathFromImage) {
		$(this).append('<img class="filter-green" src="media/check.svg" width="65px" height="65px" />');
		quizScore += 750;
	} else {
		$(this).append('<img class="filter-red" src="media/clear.svg" width="65px" height="65px" />');
		$('.answer-continent').each(function(i, d) {
			if ($(this)[0].dataset.attr == imagePathFromImage) {
				$(this).append('<img class="filter-green" src="media/check.svg" width="65px" height="65px" />');
			}
		});
	}
	
	$('.answer-continent').removeClass();
	
	$('.next-question').css({'backgroundColor': '#008000', 'color': '#fff'});
	$('.next-question').show();
	
});

$(document).on('click', '.finish-quiz', function() {
	var quizResult = $('.quiz-result').attr('data-score');
	var splitResult = quizResult.split(' ');
	quizResult = splitResult[0];
	console.log(quizResult);
	
	let currentDatetime = new Date();
	let formattedDate = currentDatetime.getDate() + "/" + (currentDatetime.getMonth() + 1) + "/" + currentDatetime.getFullYear();
	
	$.ajax({
		url: 'writeResult.php',
		type: 'post',
		data: {
			quizScore: quizResult,
			quizDate: formattedDate
		},
		success: function(result) {
			console.log(result);
			location.reload();
		}
	});
});

function formatNumber(numberToFormat) {
  return numberToFormat.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}