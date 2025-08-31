class IDFCCreativeSlider {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 2;
        this.isTransitioning = false;
        this.charts = {};
        this.animationObserver = null;
        
        // DOM Elements
        this.sliderWrapper = document.querySelector('.slider-wrapper');
        this.slides = document.querySelectorAll('.slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideCounter = document.getElementById('currentSlide');
        this.totalSlidesCounter = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.updateNavigation();
        this.addKeyboardNavigation();
        this.addTouchSupport();
        this.setupIntersectionObserver();
        this.initializeCharts();
        this.startAnimatedCounters();
        this.animateProgressBars();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.goToPrevSlide();
        });
        
        this.nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.goToNextSlide();
        });
        
        // Indicators - Fixed to ensure proper click handling
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Indicator ${index + 1} clicked`); // Debug log
                this.goToSlide(index + 1);
            });
            
            // Add keyboard support for indicators
            indicator.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    this.goToSlide(index + 1);
                }
            });
            
            // Make indicators focusable
            indicator.setAttribute('tabindex', '0');
            indicator.setAttribute('role', 'button');
            indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        });
        
        // Transition events
        this.sliderWrapper.addEventListener('transitionstart', () => {
            this.isTransitioning = true;
        });
        
        this.sliderWrapper.addEventListener('transitionend', () => {
            this.isTransitioning = false;
            this.animateSlideContent();
        });
    }
    
    goToSlide(slideNumber) {
        console.log(`Attempting to go to slide ${slideNumber}, current: ${this.currentSlide}, transitioning: ${this.isTransitioning}`);
        
        if (slideNumber < 1 || slideNumber > this.totalSlides || 
            slideNumber === this.currentSlide || this.isTransitioning) {
            console.log('Slide change blocked');
            return;
        }
        
        console.log(`Going to slide ${slideNumber}`);
        this.currentSlide = slideNumber;
        this.updateSlider();
        this.updateIndicators();
        this.updateNavigation();
        this.updateSlideCounter();
    }
    
    goToNextSlide() {
        if (this.currentSlide < this.totalSlides && !this.isTransitioning) {
            this.goToSlide(this.currentSlide + 1);
        }
    }
    
    goToPrevSlide() {
        if (this.currentSlide > 1 && !this.isTransitioning) {
            this.goToSlide(this.currentSlide - 1);
        }
    }
    
    updateSlider() {
        const translateX = -(this.currentSlide - 1) * 100;
        this.sliderWrapper.style.transform = `translateX(${translateX}%)`;
        
        this.slides.forEach((slide, index) => {
            if (index + 1 === this.currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    }
    
    updateIndicators() {
        this.indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentSlide) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-selected', 'true');
            } else {
                indicator.classList.remove('active');
                indicator.setAttribute('aria-selected', 'false');
            }
        });
    }
    
    updateNavigation() {
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
    }
    
    updateSlideCounter() {
        this.currentSlideCounter.textContent = this.currentSlide;
        this.totalSlidesCounter.textContent = this.totalSlides;
    }
    
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (document.activeElement.tagName === 'INPUT' || 
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.goToPrevSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.goToNextSlide();
                    break;
                case '1':
                    e.preventDefault();
                    this.goToSlide(1);
                    break;
                case '2':
                    e.preventDefault();
                    this.goToSlide(2);
                    break;
            }
        });
    }
    
    addTouchSupport() {
        let startX = 0;
        let endX = 0;
        
        this.sliderWrapper.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        this.sliderWrapper.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        }, { passive: true });
    }
    
    handleSwipe(startX, endX) {
        const deltaX = endX - startX;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.goToPrevSlide();
            } else {
                this.goToNextSlide();
            }
        }
    }
    
    setupIntersectionObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        // Observe all animatable elements
        document.querySelectorAll('.content-section, .metric-card, .problem-card, .persona-card, .stage-card, .capability-card, .dashboard-card, .ai-feature-card').forEach(el => {
            this.animationObserver.observe(el);
        });
    }
    
    animateSlideContent() {
        const activeSlide = document.querySelector('.slide.active');
        const elements = activeSlide.querySelectorAll('.metric-card, .problem-card, .persona-card, .stage-card, .capability-card, .dashboard-card, .ai-feature-card');
        
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    startAnimatedCounters() {
        const counters = document.querySelectorAll('.animated-counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target);
            const valueElement = counter.querySelector('.metric-value');
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    valueElement.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    valueElement.textContent = Math.floor(current) + '%';
                }
            }, 20);
        });
    }
    
    animateProgressBars() {
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-bar');
            progressBars.forEach(bar => {
                const width = bar.dataset.width;
                bar.style.width = width + '%';
            });
        }, 1000);
    }
    
    initializeCharts() {
        // Chart.js default configuration
        Chart.defaults.font.family = 'var(--font-family-base)';
        Chart.defaults.color = '#626C7C';
        
        // Initialize all charts
        this.createProblemCharts();
        this.createPersonaCharts();
        this.createAcquisitionFunnelChart();
        this.createCapabilityGauges();
        this.createDashboardGauges();
        this.createAIFeatureCharts();
        this.createRevenueGrowthChart();
        this.createCompetitiveRadarChart();
        this.createResourceCharts();
    }
    
    createProblemCharts() {
        const problems = [
            { id: 'qualityChart', value: 85, color: '#C0152F' },
            { id: 'misuseChart', value: 65, color: '#9C1D26' },
            { id: 'familyChart', value: 70, color: '#D73348' },
            { id: 'engagementChart', value: 60, color: '#B01B35' }
        ];
        
        problems.forEach(problem => {
            const ctx = document.getElementById(problem.id);
            if (ctx) {
                this.charts[problem.id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [problem.value, 100 - problem.value],
                            backgroundColor: [problem.color, '#E5E7EB'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '70%',
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        },
                        elements: {
                            arc: {
                                borderRadius: 8
                            }
                        }
                    },
                    plugins: [{
                        beforeDraw: function(chart) {
                            const width = chart.width;
                            const height = chart.height;
                            const ctx = chart.ctx;
                            
                            ctx.restore();
                            const fontSize = (height / 80).toFixed(2);
                            ctx.font = `bold ${fontSize}em var(--font-family-base)`;
                            ctx.fillStyle = problem.color;
                            ctx.textBaseline = 'middle';
                            
                            const text = problem.value + '%';
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;
                            
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }]
                });
            }
        });
    }
    
    createPersonaCharts() {
        const personas = [
            { id: 'corporateChart', data: [50000, 35000, 15000], labels: ['Total Market', 'Qualified', 'Accessible'] },
            { id: 'startupChart', data: [25000, 18000, 8000], labels: ['Total Market', 'Qualified', 'Accessible'] },
            { id: 'businessChart', data: [35000, 25000, 12000], labels: ['Total Market', 'Qualified', 'Accessible'] }
        ];
        
        personas.forEach(persona => {
            const ctx = document.getElementById(persona.id);
            if (ctx) {
                this.charts[persona.id] = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: persona.labels,
                        datasets: [{
                            data: persona.data,
                            backgroundColor: ['#1FB8CD', '#FFC185', '#C0152F'],
                            borderRadius: 8,
                            borderSkipped: false
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { display: false },
                                ticks: {
                                    callback: function(value) {
                                        return (value / 1000) + 'K';
                                    }
                                }
                            },
                            x: {
                                grid: { display: false }
                            }
                        }
                    }
                });
            }
        });
    }
    
    createAcquisitionFunnelChart() {
        const ctx = document.getElementById('acquisitionFunnelChart');
        if (ctx) {
            this.charts.acquisitionFunnelChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Target Universe', 'Qualified Prospects', 'Engaged Prospects', 'Converted Customers', 'Active Families'],
                    datasets: [{
                        label: 'Count',
                        data: [110000, 35000, 15000, 8000, 7200],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#C0152F', '#9C1D26'],
                        borderRadius: 8,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.parsed.x.toLocaleString() + ' prospects';
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { color: '#E5E7EB' },
                            ticks: {
                                callback: function(value) {
                                    return (value / 1000) + 'K';
                                }
                            }
                        },
                        y: {
                            grid: { display: false }
                        }
                    }
                }
            });
        }
    }
    
    createCapabilityGauges() {
        const capabilities = [
            { id: 'aiGauge', value: 90, color: '#1FB8CD' },
            { id: 'digitalGauge', value: 95, color: '#2ECC71' },
            { id: 'partnershipGauge', value: 75, color: '#9B59B6' },
            { id: 'riskGauge', value: 85, color: '#C0152F' }
        ];
        
        capabilities.forEach(capability => {
            const ctx = document.getElementById(capability.id);
            if (ctx) {
                this.charts[capability.id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [capability.value, 100 - capability.value],
                            backgroundColor: [capability.color, '#E5E7EB'],
                            borderWidth: 0,
                            circumference: 180,
                            rotation: 270
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '80%',
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    },
                    plugins: [{
                        beforeDraw: function(chart) {
                            const width = chart.width;
                            const height = chart.height;
                            const ctx = chart.ctx;
                            
                            ctx.restore();
                            const fontSize = (height / 120).toFixed(2);
                            ctx.font = `bold ${fontSize}em var(--font-family-base)`;
                            ctx.fillStyle = capability.color;
                            ctx.textBaseline = 'middle';
                            
                            const text = capability.value + '%';
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 1.5;
                            
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }]
                });
            }
        });
    }
    
    createDashboardGauges() {
        const metrics = [
            { id: 'usageGauge', value: 92, target: 90, color: '#2ECC71' },
            { id: 'participationGauge', value: 88, target: 85, color: '#1FB8CD' },
            { id: 'utilizationGauge', value: 85, target: 80, color: '#9B59B6' },
            { id: 'satisfactionGauge', value: 94, target: 90, color: '#C0152F' }
        ];
        
        metrics.forEach(metric => {
            const ctx = document.getElementById(metric.id);
            if (ctx) {
                this.charts[metric.id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [metric.value, 100 - metric.value],
                            backgroundColor: [metric.color, '#E5E7EB'],
                            borderWidth: 0,
                            circumference: 270,
                            rotation: 225
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: { display: false },
                            tooltip: { enabled: false }
                        }
                    },
                    plugins: [{
                        beforeDraw: function(chart) {
                            const width = chart.width;
                            const height = chart.height;
                            const ctx = chart.ctx;
                            
                            ctx.restore();
                            const fontSize = (height / 100).toFixed(2);
                            ctx.font = `bold ${fontSize}em var(--font-family-base)`;
                            ctx.fillStyle = metric.color;
                            ctx.textBaseline = 'middle';
                            
                            const text = metric.value + '%';
                            const textX = Math.round((width - ctx.measureText(text).width) / 2);
                            const textY = height / 2;
                            
                            ctx.fillText(text, textX, textY);
                            ctx.save();
                        }
                    }]
                });
            }
        });
    }
    
    createAIFeatureCharts() {
        const features = [
            { id: 'engagementScoreChart', data: [95, 5], color: '#1FB8CD' },
            { id: 'warningChart', data: [88, 12], color: '#FFC185' },
            { id: 'opportunityChart', data: [92, 8], color: '#2ECC71' },
            { id: 'mappingChart', data: [90, 10], color: '#9B59B6' }
        ];
        
        features.forEach(feature => {
            const ctx = document.getElementById(feature.id);
            if (ctx) {
                this.charts[feature.id] = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                        datasets: [{
                            data: [feature.data[0] - 5, feature.data[0] - 2, feature.data[0], feature.data[0] + 1],
                            borderColor: feature.color,
                            backgroundColor: feature.color + '20',
                            fill: true,
                            tension: 0.4,
                            pointRadius: 4,
                            pointBackgroundColor: feature.color
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false }
                        },
                        scales: {
                            y: {
                                beginAtZero: false,
                                min: feature.data[0] - 10,
                                max: feature.data[0] + 5,
                                grid: { color: '#E5E7EB' }
                            },
                            x: {
                                grid: { display: false }
                            }
                        }
                    }
                });
            }
        });
    }
    
    createRevenueGrowthChart() {
        const ctx = document.getElementById('revenueGrowthChart');
        if (ctx) {
            this.charts.revenueGrowthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6'],
                    datasets: [
                        {
                            label: 'Revenue (₹Cr)',
                            data: [50, 125, 220, 350, 450, 520],
                            borderColor: '#C0152F',
                            backgroundColor: '#C0152F20',
                            fill: true,
                            tension: 0.4,
                            yAxisID: 'y'
                        },
                        {
                            label: 'Customers',
                            data: [1000, 2500, 4500, 6500, 8000, 8000],
                            borderColor: '#1FB8CD',
                            backgroundColor: '#1FB8CD20',
                            fill: true,
                            tension: 0.4,
                            yAxisID: 'y1'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    },
                    scales: {
                        x: {
                            grid: { color: '#E5E7EB' }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: '#E5E7EB' },
                            title: {
                                display: true,
                                text: 'Revenue (₹Cr)'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            title: {
                                display: true,
                                text: 'Customers'
                            }
                        }
                    }
                }
            });
        }
    }
    
    createCompetitiveRadarChart() {
        const ctx = document.getElementById('competitiveRadarChart');
        if (ctx) {
            this.charts.competitiveRadarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Innovation', 'Technology', 'Family Focus', 'Quality Control', 'Partnership Network'],
                    datasets: [
                        {
                            label: 'IDFC FIRST',
                            data: [95, 90, 98, 92, 85],
                            borderColor: '#C0152F',
                            backgroundColor: '#C0152F30',
                            pointBackgroundColor: '#C0152F',
                            pointBorderColor: '#C0152F',
                            pointHoverBackgroundColor: '#C0152F'
                        },
                        {
                            label: 'Competitors',
                            data: [70, 75, 60, 65, 70],
                            borderColor: '#9CA3AF',
                            backgroundColor: '#9CA3AF20',
                            pointBackgroundColor: '#9CA3AF',
                            pointBorderColor: '#9CA3AF',
                            pointHoverBackgroundColor: '#9CA3AF'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                color: '#E5E7EB'
                            },
                            grid: {
                                color: '#E5E7EB'
                            },
                            pointLabels: {
                                font: {
                                    size: 12
                                }
                            },
                            ticks: {
                                beginAtZero: true,
                                max: 100,
                                stepSize: 20
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            position: 'top'
                        }
                    }
                }
            });
        }
    }
    
    createResourceCharts() {
        const resources = [
            { id: 'techResourceChart', data: [60, 40], labels: ['Allocated', 'Remaining'] },
            { id: 'opsResourceChart', data: [40, 60], labels: ['Allocated', 'Remaining'] },
            { id: 'partnerResourceChart', data: [35, 65], labels: ['Allocated', 'Remaining'] },
            { id: 'marketingResourceChart', data: [75, 25], labels: ['Allocated', 'Remaining'] }
        ];
        
        resources.forEach(resource => {
            const ctx = document.getElementById(resource.id);
            if (ctx) {
                this.charts[resource.id] = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: resource.labels,
                        datasets: [{
                            data: resource.data,
                            backgroundColor: ['#C0152F', '#E5E7EB'],
                            borderWidth: 0
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '60%',
                        plugins: {
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            }
                        }
                    }
                });
            }
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #C0152F, #9C1D26); display: flex; align-items: center; justify-content: center; z-index: 9999; opacity: 1; transition: opacity 0.5s ease;">
            <div style="text-align: center; color: white;">
                <div style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">IDFC FIRST Bank</div>
                <div style="font-size: 14px; opacity: 0.9;">Loading Creative Strategy Dashboard...</div>
            </div>
        </div>
    `;
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loadingOverlay);
    
    // Initialize slider after a delay to allow charts to load
    setTimeout(() => {
        const slider = new IDFCCreativeSlider();
        window.idfcSlider = slider;
        
        // Remove loading overlay
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
        
        // Add enhanced interactions
        addEnhancedInteractions();
        
        console.log('IDFC Creative Slider initialized successfully');
        
    }, 2000);
});

function addEnhancedInteractions() {
    // Parallax effect for floating shapes
    document.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.floating-shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const xOffset = (x - 0.5) * speed * 20;
            const yOffset = (y - 0.5) * speed * 20;
            shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
    
    // Enhanced card hover effects
    document.querySelectorAll('.metric-card, .problem-card, .persona-card, .capability-card, .dashboard-card, .ai-feature-card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
            card.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        });
        
        card.addEventListener('mouseleave', (e) => {
            card.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add ripple effect on click
        card.addEventListener('click', (e) => {
            const ripple = document.createElement('div');
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(192, 21, 47, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 10;
            `;
            
            card.style.position = 'relative';
            card.style.overflow = 'hidden';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Stage cards connection animation
    const stageCards = document.querySelectorAll('.stage-card');
    stageCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Highlight the connection path
            const connector = card.querySelector('.stage-connector');
            if (connector) {
                connector.style.background = 'linear-gradient(90deg, #C0152F, #FFD700)';
                connector.style.height = '4px';
                connector.style.boxShadow = '0 0 10px rgba(192, 21, 47, 0.5)';
            }
            
            // Animate subsequent stages
            for (let i = index + 1; i < stageCards.length; i++) {
                setTimeout(() => {
                    stageCards[i].style.transform = 'translateX(5px)';
                    stageCards[i].style.transition = 'transform 0.2s ease';
                }, (i - index) * 100);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const connector = card.querySelector('.stage-connector');
            if (connector) {
                connector.style.background = 'var(--idfc-gradient)';
                connector.style.height = '2px';
                connector.style.boxShadow = 'none';
            }
            
            // Reset subsequent stages
            for (let i = index + 1; i < stageCards.length; i++) {
                stageCards[i].style.transform = 'translateX(0)';
            }
        });
    });
    
    // Family tree hover effects
    const familyMembers = document.querySelectorAll('.family-member');
    familyMembers.forEach(member => {
        member.addEventListener('mouseenter', () => {
            // Dim other members
            familyMembers.forEach(otherMember => {
                if (otherMember !== member) {
                    otherMember.style.opacity = '0.6';
                    otherMember.style.transition = 'opacity 0.3s ease';
                }
            });
            
            // Highlight services
            const services = member.querySelectorAll('.service');
            services.forEach((service, index) => {
                setTimeout(() => {
                    service.style.transform = 'scale(1.05)';
                    service.style.boxShadow = '0 4px 15px rgba(192, 21, 47, 0.2)';
                }, index * 100);
            });
        });
        
        member.addEventListener('mouseleave', () => {
            // Restore all members
            familyMembers.forEach(otherMember => {
                otherMember.style.opacity = '1';
            });
            
            // Reset services
            const services = member.querySelectorAll('.service');
            services.forEach(service => {
                service.style.transform = 'scale(1)';
                service.style.boxShadow = 'none';
            });
        });
    });
    
    // Add subtle animations to navigation
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            if (!btn.disabled) {
                btn.style.transform = 'scale(1.1) rotate(5deg)';
                btn.style.boxShadow = '0 8px 25px rgba(192, 21, 47, 0.4)';
            }
        });
        
        btn.addEventListener('mouseleave', () => {
            if (!btn.disabled) {
                btn.style.transform = 'scale(1) rotate(0deg)';
                btn.style.boxShadow = '0 4px 15px rgba(192, 21, 47, 0.2)';
            }
        });
    });
}

// Add custom CSS animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.2); }
    }
    
    .capability-card:hover .capability-icon {
        animation: glow 2s ease-in-out infinite;
    }
    
    .stage-number {
        position: relative;
        overflow: hidden;
    }
    
    .stage-number::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transition: left 0.5s ease;
    }
    
    .stage-card:hover .stage-number::before {
        left: 100%;
    }
    
    .metric-card::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
        transform: translateX(-100%);
        transition: transform 0.6s ease;
    }
    
    .metric-card:hover::after {
        transform: translateX(100%);
    }
    
    /* Enhanced indicator styles for better click detection */
    .indicator {
        cursor: pointer !important;
        border: 2px solid transparent;
        transition: all 0.3s ease;
        position: relative;
        z-index: 100;
    }
    
    .indicator:hover {
        transform: scale(1.2);
        border-color: rgba(192, 21, 47, 0.3);
    }
    
    .indicator:focus {
        outline: 2px solid #C0152F;
        outline-offset: 2px;
    }
`;

document.head.appendChild(additionalStyles);