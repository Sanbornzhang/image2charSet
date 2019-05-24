
import cv2
 
ascii_char = list("$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,\"^`'. ")
 
# 将灰度值转为字符
def get_char(gray_number):
    print(gray_number)
    length = len(ascii_char)
    unit = (256.0 + 1)/length
    return ascii_char[int(gray_number/unit)]
 
if __name__ == '__main__':
    image = cv2.imread('image.png')
    gray = cv2.cvtColor(image,cv2.COLOR_BGR2GRAY)
    txt = ""
    for i in range(image.shape[0]):
        for j in range(image.shape[1]):
            txt += get_char(gray[i,j])
        txt += '\n'
    # print(txt)
    #字符画输出到文件中
    open('output.txt','w')
