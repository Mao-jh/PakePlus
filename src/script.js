// 服务信息管理类
class ServiceManager {
    constructor() {
        this.init();
        this.activeTooltip = null;
        this.tooltipTimeout = null;
    }

    init() {
        // 初始化所有按钮的事件监听
        document.querySelectorAll('.button').forEach(button => {
            const info = button.querySelector('.button-info');
            if (info) {
                // 将信息内容保存到按钮的data属性中
                button.setAttribute('data-info', info.textContent);
                info.remove();
            }

            // 添加鼠标进入事件
            button.addEventListener('mouseenter', (e) => {
                clearTimeout(this.tooltipTimeout);
                this.showTooltip(e, button);
            });

            // 添加鼠标离开事件
            button.addEventListener('mouseleave', () => {
                this.tooltipTimeout = setTimeout(() => this.hideTooltip(), 100);
            });

            // 添加点击事件
            button.addEventListener('click', (e) => this.handleClick(e, button));
        });

        // 创建全局tooltip容器
        this.createTooltipContainer();
    }

    createTooltipContainer() {
        const container = document.createElement('div');
        container.id = 'tooltip-container';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.2s ease';
        
        // 添加鼠标进入事件，防止tooltip闪烁
        container.addEventListener('mouseenter', () => {
            clearTimeout(this.tooltipTimeout);
        });
        
        // 添加鼠标离开事件
        container.addEventListener('mouseleave', () => {
            this.hideTooltip();
        });
        
        document.body.appendChild(container);
        this.tooltipContainer = container;
    }

    showTooltip(e, button) {
        const info = button.getAttribute('data-info');
        if (!info) return;

        // 更新tooltip内容
        this.tooltipContainer.innerHTML = `
            <div class="tooltip-content">
                ${info}
            </div>
        `;

        // 计算位置
        const rect = button.getBoundingClientRect();
        const isMainService = button.closest('.main-services');
        
        if (isMainService) {
            this.tooltipContainer.style.left = `${rect.right + 15}px`;
            this.tooltipContainer.style.top = `${rect.top}px`;
        } else {
            this.tooltipContainer.style.left = `${rect.left - this.tooltipContainer.offsetWidth - 15}px`;
            this.tooltipContainer.style.top = `${rect.top}px`;
        }

        // 显示tooltip
        requestAnimationFrame(() => {
            this.tooltipContainer.style.opacity = '1';
        });
        this.activeTooltip = button;
    }

    hideTooltip() {
        if (this.tooltipContainer) {
            this.tooltipContainer.style.opacity = '0';
            this.activeTooltip = null;
        }
    }

    handleClick(e, button) {
        if (button.classList.contains('imageButton')) {
            ImageManager.showImage(button);
        } else if (button.id === 'copyButton') {
            const text = button.getAttribute('data-copy') || '2127920388';
            copyToClipboard(text);
        }
    }
}

// 图片管理类
class ImageManager {
    static showImage(button) {
        const img = button.querySelector('img');
        if (!img) return;

        const overlay = document.querySelector('.overlay');
        const container = document.querySelector('.image-container');
        
        // 清空并添加新图片
        container.innerHTML = '';
        const displayImg = document.createElement('img');
        displayImg.src = img.src;
        displayImg.alt = img.alt;
        container.appendChild(displayImg);

        // 显示遮罩和容器
        overlay.classList.add('active');
        container.classList.add('active');

        // 添加关闭事件
        const closeImage = () => {
            overlay.classList.remove('active');
            container.classList.remove('active');
            setTimeout(() => container.innerHTML = '', 300);
        };

        overlay.onclick = closeImage;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeImage();
        }, { once: true });
    }
}

// 复制功能
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('已复制至剪贴板');
        })
        .catch(err => {
            console.error('复制失败:', err);
            showNotification('复制失败', 'error');
        });
}

// 通知提示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 动画显示
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    });

    // 自动消失
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ServiceManager();
}); 